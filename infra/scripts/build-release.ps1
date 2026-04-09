param(
  [string]$ArtifactName
)

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$deployRoot = Join-Path $repoRoot ".deploy"
$stagingDir = Join-Path $deployRoot "staging"
$artifactsDir = Join-Path $deployRoot "artifacts"
$latestArtifactFile = Join-Path $deployRoot "latest-artifact.json"

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

  Copy-Item package.json $stagingDir
  Copy-Item pnpm-lock.yaml $stagingDir
  Copy-Item pnpm-workspace.yaml $stagingDir
  Copy-Item next.config.ts $stagingDir

  Copy-Item -Recurse public (Join-Path $stagingDir "public")
  Copy-Item -Recurse .next (Join-Path $stagingDir ".next")

  New-Item -ItemType Directory -Force -Path (Join-Path $stagingDir "src") | Out-Null
  New-Item -ItemType Directory -Force -Path (Join-Path $stagingDir "src/server") | Out-Null

  Copy-Item src/server/package.json (Join-Path $stagingDir "src/server/package.json")
  Copy-Item -Recurse src/server/dist (Join-Path $stagingDir "src/server/dist")

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
