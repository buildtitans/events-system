param(
  [string]$ArtifactName
)

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$deployRoot = Join-Path $repoRoot ".deploy"
$stagingDir = Join-Path $deployRoot "staging"
$artifactsDir = Join-Path $deployRoot "artifacts"
$latestArtifactFile = Join-Path $deployRoot "latest-artifact.json"

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

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

if (-not $ArtifactName) {
  $ArtifactName = "events-system-$timestamp.tgz"
}

if (Test-Path $stagingDir) {
  Remove-Item -Recurse -Force $stagingDir
}

New-Item -ItemType Directory -Force -Path $stagingDir | Out-Null
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
  $publicSourceDir = Join-Path $repoRoot "public"
  $nextStandaloneStagingDir = Join-Path $stagingDir "next-standalone"
  $nextStandaloneStaticDir = Join-Path $nextStandaloneStagingDir ".next/static"
  $nextStandalonePublicDir = Join-Path $nextStandaloneStagingDir "public"

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
  Copy-ReleaseDirectory -SourceDir $publicSourceDir -DestinationDir $nextStandalonePublicDir
  Copy-ReleaseDirectory -SourceDir $nextStaticSourceDir -DestinationDir $nextStandaloneStaticDir

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
