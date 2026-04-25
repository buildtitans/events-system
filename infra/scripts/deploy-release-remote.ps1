param(
  [Parameter(Mandatory = $true)]
  [string]$InstanceId,

  [string]$Bucket,

  [string]$Key
)

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$deployRoot = Join-Path $repoRoot ".deploy"
$latestUploadFile = Join-Path $deployRoot "latest-upload.json"

if (-not $Bucket -or -not $Key) {
  if (-not (Test-Path $latestUploadFile)) {
    throw "No latest upload metadata found. Run upload-release.ps1 first or pass -Bucket and -Key."
  }

  $latestUpload = Get-Content $latestUploadFile | ConvertFrom-Json
  $Bucket = $latestUpload.bucket
  $Key = $latestUpload.key
}

$commands = @(
  "rm -rf /tmp/events-system-release /tmp/events-system-release.tgz",
  "mkdir -p /tmp/events-system-release",
  "aws s3 cp s3://$Bucket/$Key /tmp/events-system-release.tgz",
  "tar -xzf /tmp/events-system-release.tgz -C /tmp/events-system-release",
  "systemctl stop next || true",
  "systemctl stop fastify || true",
  "rm -rf /var/www/events-system",
  "mkdir -p /var/www/events-system",
  "cp -a /tmp/events-system-release/. /var/www/events-system/",
  "cd /var/www/events-system",
  "pnpm install --prod --frozen-lockfile",
  "/usr/local/bin/refresh-events-system-env.sh",
  "systemctl daemon-reload",
  "systemctl enable next",
  "systemctl enable fastify",
  "systemctl restart next",
  "systemctl restart fastify",
  "systemctl restart nginx"
)

$quotedCommands = ($commands | ForEach-Object {
  '"{0}"' -f ($_ -replace '"', '\"')
}) -join ","

$parameters = "commands=[$quotedCommands]"

$commandId = aws ssm send-command `
  --instance-ids $InstanceId `
  --document-name "AWS-RunShellScript" `
  --comment "Events System release deploy" `
  --parameters $parameters `
  --query "Command.CommandId" `
  --output text

if (-not $commandId -or $commandId -eq "None") {
  throw "Failed to submit SSM deploy command."
}

Write-Host "Submitted SSM command: $commandId"

$terminalStatuses = @("Success", "Cancelled", "TimedOut", "Failed", "Cancelling")
$invocation = $null

while ($true) {
  Start-Sleep -Seconds 2

  try {
    $invocationJson = aws ssm get-command-invocation `
      --command-id $commandId `
      --instance-id $InstanceId `
      --output json 2>$null

    if (-not $invocationJson) {
      continue
    }

    $invocation = $invocationJson | ConvertFrom-Json
  } catch {
    continue
  }

  Write-Host "Current status: $($invocation.Status)"

  if ($terminalStatuses -contains $invocation.Status) {
    break
  }
}

if ($invocation.StandardOutputContent) {
  Write-Host ""
  Write-Host "=== STDOUT ==="
  Write-Host $invocation.StandardOutputContent
}

if ($invocation.StandardErrorContent) {
  Write-Host ""
  Write-Host "=== STDERR ==="
  Write-Host $invocation.StandardErrorContent
}

if ($invocation.Status -ne "Success") {
  throw "Remote deploy failed with status: $($invocation.Status)"
}

Write-Host "Remote deploy completed successfully."
