param(
  [string]$ArtifactName
)

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$deployRoot = Join-Path $repoRoot ".deploy"
$stagingDir = Join-Path $deployRoot "staging"
$artifactsDir = Join-Path $deployRoot "artifacts"
$latestArtifactFile = Join-Path $deployRoot "latest-artifact.json"
$emptyMirrorDir = Join-Path $deployRoot ".empty-mirror"

function Copy-ReleaseFile {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Source,

    [Parameter(Mandatory = $true)]
    [string]$Destination
  )

  if (-not (Test-Path -LiteralPath $Source)) {
    throw "Release source path not found: $Source"
  }

  $destinationParent = Split-Path -Parent $Destination
  if ($destinationParent) {
    New-Item -ItemType Directory -Force -Path $destinationParent | Out-Null
  }

  Copy-Item -LiteralPath $Source -Destination $Destination -Force
}

function Copy-ReleaseDirectory {
  param(
    [Parameter(Mandatory = $true)]
    [string]$SourceDir,

    [Parameter(Mandatory = $true)]
    [string]$DestinationDir,

    [string[]]$ExcludeDirectories = @(),

    [string[]]$ExcludeFiles = @()
  )

  if (-not (Test-Path -LiteralPath $SourceDir -PathType Container)) {
    throw "Release source directory not found: $SourceDir"
  }

  New-Item -ItemType Directory -Force -Path $DestinationDir | Out-Null

  $robocopyArgs = @(
    $SourceDir,
    $DestinationDir,
    "/E",
    "/R:2",
    "/W:1",
    "/NFL",
    "/NDL",
    "/NJH",
    "/NJS",
    "/NP"
  )

  if ($ExcludeDirectories.Count -gt 0) {
    $robocopyArgs += "/XD"
    $robocopyArgs += $ExcludeDirectories
  }

  if ($ExcludeFiles.Count -gt 0) {
    $robocopyArgs += "/XF"
    $robocopyArgs += $ExcludeFiles
  }

  & robocopy @robocopyArgs | Out-Null

  if ($LASTEXITCODE -ge 8) {
    throw "robocopy failed copying '$SourceDir' to '$DestinationDir' with exit code $LASTEXITCODE."
  }
}

function Reset-ReleaseDirectory {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path
  )

  New-Item -ItemType Directory -Force -Path $emptyMirrorDir | Out-Null

  if (-not (Test-Path -LiteralPath $Path -PathType Container)) {
    New-Item -ItemType Directory -Force -Path $Path | Out-Null
    return
  }

  & robocopy $emptyMirrorDir $Path /MIR /R:2 /W:1 /NFL /NDL /NJH /NJS /NP | Out-Null

  if ($LASTEXITCODE -ge 8) {
    throw "robocopy failed resetting '$Path' with exit code $LASTEXITCODE."
  }
}

function Get-AvailableLoopbackPort {
  $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
  $listener.Start()

  try {
    return ([System.Net.IPEndPoint]$listener.LocalEndpoint).Port
  }
  finally {
    $listener.Stop()
  }
}

function Test-StandaloneBundle {
  param(
    [Parameter(Mandatory = $true)]
    [string]$BundleDir,

    [int]$StartupTimeoutSeconds = 15
  )

  $serverEntry = Join-Path $BundleDir "server.js"
  if (-not (Test-Path -LiteralPath $serverEntry -PathType Leaf)) {
    throw "Standalone bundle smoke test failed: missing server entry at '$serverEntry'."
  }

  $port = Get-AvailableLoopbackPort

  $processStartInfo = [System.Diagnostics.ProcessStartInfo]::new()
  $processStartInfo.FileName = "node"
  $processStartInfo.Arguments = "server.js"
  $processStartInfo.WorkingDirectory = $BundleDir
  $processStartInfo.UseShellExecute = $false
  $processStartInfo.RedirectStandardOutput = $true
  $processStartInfo.RedirectStandardError = $true
  $processStartInfo.EnvironmentVariables["PORT"] = [string]$port
  $processStartInfo.EnvironmentVariables["HOSTNAME"] = "127.0.0.1"

  $process = [System.Diagnostics.Process]::new()
  $process.StartInfo = $processStartInfo

  $started = $false
  $healthy = $false
  $probeUri = "http://127.0.0.1:$port/"

  try {
    $started = $process.Start()
    if (-not $started) {
      throw "Standalone bundle smoke test failed: node process did not start."
    }

    $deadline = (Get-Date).AddSeconds($StartupTimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
      if ($process.HasExited) {
        break
      }

      try {
        $response = Invoke-WebRequest -Uri $probeUri -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
          $healthy = $true
          break
        }
      }
      catch {
        Start-Sleep -Milliseconds 250
      }
    }

    if (-not $healthy) {
      $process.WaitForExit(1000) | Out-Null
      $stdout = $process.StandardOutput.ReadToEnd().Trim()
      $stderr = $process.StandardError.ReadToEnd().Trim()

      $reason = if ($process.HasExited) {
        "node exited with code $($process.ExitCode)"
      } else {
        "timed out waiting for a successful response from $probeUri"
      }

      throw @"
Standalone bundle smoke test failed: $reason

STDOUT:
$stdout

STDERR:
$stderr
"@
    }

    Write-Host "Standalone bundle smoke test passed on $probeUri"
  }
  finally {
    if ($started) {
      if (-not $process.HasExited) {
        $process.Kill()
        $process.WaitForExit(5000) | Out-Null
      } else {
        $process.WaitForExit() | Out-Null
      }
    }

    $process.Dispose()
  }
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

if (-not $ArtifactName) {
  $ArtifactName = "events-system-$timestamp.tgz"
}

Reset-ReleaseDirectory -Path $stagingDir
New-Item -ItemType Directory -Force -Path $artifactsDir | Out-Null

Push-Location $repoRoot
try {
  pnpm build
  if ($LASTEXITCODE -ne 0) {
    throw "pnpm build failed with exit code $LASTEXITCODE."
  }

  pnpm --dir src/server build:fastify
  if ($LASTEXITCODE -ne 0) {
    throw "pnpm --dir src/server build:fastify failed with exit code $LASTEXITCODE."
  }

  $nextSourceDir = Join-Path $repoRoot ".next"
  $nextStandaloneSourceDir = Join-Path $nextSourceDir "standalone"
  $nextStaticSourceDir = Join-Path $nextSourceDir "static"
  $nextStandaloneSharedNodeModulesSourceDir = Join-Path $nextStandaloneSourceDir "node_modules/.pnpm/node_modules"
  $publicSourceDir = Join-Path $repoRoot "public"
  $nextStandaloneStagingDir = Join-Path $stagingDir "next-standalone"
  $nextStandaloneStaticDir = Join-Path $nextStandaloneStagingDir ".next/static"
  $nextStandalonePublicDir = Join-Path $nextStandaloneStagingDir "public"
  $nextStandaloneNodeModulesStagingDir = Join-Path $nextStandaloneStagingDir "node_modules"
  $systemdSourceDir = Join-Path $repoRoot "infra/systemd"
  $systemdStagingDir = Join-Path $stagingDir "infra/systemd"

  # Keep the workspace root package metadata for the existing Fastify install
  # flow, but stage the Next runtime as an explicit standalone bundle.
  Copy-ReleaseFile -Source (Join-Path $repoRoot "package.json") -Destination (Join-Path $stagingDir "package.json")
  Copy-ReleaseFile -Source (Join-Path $repoRoot "pnpm-lock.yaml") -Destination (Join-Path $stagingDir "pnpm-lock.yaml")
  Copy-ReleaseFile -Source (Join-Path $repoRoot "pnpm-workspace.yaml") -Destination (Join-Path $stagingDir "pnpm-workspace.yaml")
  Copy-ReleaseFile -Source (Join-Path $repoRoot "next.config.ts") -Destination (Join-Path $stagingDir "next.config.ts")

  # Next's standalone server does not include public assets or .next/static by
  # default, so stage them alongside the generated runtime explicitly.
  Copy-ReleaseDirectory `
    -SourceDir $nextStandaloneSourceDir `
    -DestinationDir $nextStandaloneStagingDir `
    -ExcludeFiles @(".env")
  # Next's standalone output relies on pnpm junctions inside
  # `node_modules/.pnpm/node_modules`. Windows packaging flattens those
  # junctions, so materialize the shared packages at the staged top level
  # before archiving to keep the runtime self-contained on Linux.
  Copy-ReleaseDirectory `
    -SourceDir $nextStandaloneSharedNodeModulesSourceDir `
    -DestinationDir $nextStandaloneNodeModulesStagingDir
  Copy-ReleaseDirectory -SourceDir $publicSourceDir -DestinationDir $nextStandalonePublicDir
  Copy-ReleaseDirectory -SourceDir $nextStaticSourceDir -DestinationDir $nextStandaloneStaticDir
  Copy-ReleaseDirectory -SourceDir $systemdSourceDir -DestinationDir $systemdStagingDir
  Test-StandaloneBundle -BundleDir $nextStandaloneStagingDir

  Copy-ReleaseFile `
    -Source (Join-Path $repoRoot "src/server/package.json") `
    -Destination (Join-Path $stagingDir "src/server/package.json")
  Copy-ReleaseDirectory `
    -SourceDir (Join-Path $repoRoot "src/server/dist") `
    -DestinationDir (Join-Path $stagingDir "src/server/dist")

  $artifactPath = Join-Path $artifactsDir $ArtifactName

  if (Test-Path $artifactPath) {
    Remove-Item -Force $artifactPath
  }

  tar -czf $artifactPath -C $stagingDir .
  if ($LASTEXITCODE -ne 0) {
    throw "tar -czf failed with exit code $LASTEXITCODE."
  }

  $latest = @{
    artifactPath = $artifactPath
    artifactName = $ArtifactName
  }

  $latest | ConvertTo-Json | Set-Content -Path $latestArtifactFile -Encoding utf8

  Write-Host "Artifact created:"
  Write-Host $artifactPath
}
finally {
  Pop-Location
}
