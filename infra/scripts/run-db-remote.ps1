param(
  [Parameter(Mandatory = $true)]
  [string]$InstanceId,

  [switch]$Seed
)

$commands = @(
  "/usr/local/bin/refresh-events-system-env.sh",
  "cd /var/www/events-system/src/server",
  "set -a",
  ". /etc/events-system/server.env",
  "set +a",
  "pnpm db:migrate:prod"
)

if ($Seed) {
  $commands += "pnpm db:seed:prod"
}

$quotedCommands = ($commands | ForEach-Object {
  '"{0}"' -f ($_ -replace '"', '\"')
}) -join ","

$parameters = "commands=[$quotedCommands]"

$commandId = aws ssm send-command `
  --instance-ids $InstanceId `
  --document-name "AWS-RunShellScript" `
  --comment "Events System DB remote task" `
  --parameters $parameters `
  --query "Command.CommandId" `
  --output text

if (-not $commandId -or $commandId -eq "None") {
  throw "Failed to submit SSM command."
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
  throw "Remote DB task failed with status: $($invocation.Status)"
}

Write-Host "Remote DB task completed successfully."
