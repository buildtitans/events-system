param(
  [Parameter(Mandatory = $true)]
  [string]$Bucket,

  [string]$ArtifactPath,

  [string]$KeyPrefix = "releases"
)

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$deployRoot = Join-Path $repoRoot ".deploy"
$latestArtifactFile = Join-Path $deployRoot "latest-artifact.json"
$latestUploadFile = Join-Path $deployRoot "latest-upload.json"

if (-not $ArtifactPath) {
  if (-not (Test-Path $latestArtifactFile)) {
    throw "No latest artifact metadata found. Run build-release.ps1 first or pass -ArtifactPath."
  }

  $latestArtifact = Get-Content $latestArtifactFile | ConvertFrom-Json
  $ArtifactPath = $latestArtifact.artifactPath
}

if (-not (Test-Path $ArtifactPath)) {
  throw "Artifact not found: $ArtifactPath"
}

$artifactName = Split-Path $ArtifactPath -Leaf
$key = "$KeyPrefix/$artifactName"

aws s3 cp $ArtifactPath "s3://$Bucket/$key"
if ($LASTEXITCODE -ne 0) {
  throw "aws s3 cp failed with exit code $LASTEXITCODE."
}

$latestUpload = @{
  bucket = $Bucket
  key = $key
  artifactPath = $ArtifactPath
}

$latestUpload | ConvertTo-Json | Set-Content -Path $latestUploadFile -Encoding utf8

Write-Host "Uploaded artifact:"
Write-Host "s3://$Bucket/$key"
