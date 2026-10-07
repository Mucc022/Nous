$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$homeRoot = Join-Path (Split-Path -Parent $projectRoot) "questory-home"
$tunnelId = "2b9bd7e4-c7cb-4227-bc66-99f9f108ef65"

$portInUse = Get-NetTCPConnection -State Listen -LocalPort 3000 -ErrorAction SilentlyContinue
if (-not $portInUse) {
  Start-Process -FilePath "npx.cmd" `
    -ArgumentList "vinext", "start", "--port", "3000" `
    -WorkingDirectory $projectRoot `
    -WindowStyle Hidden
}

$homePortInUse = Get-NetTCPConnection -State Listen -LocalPort 3001 -ErrorAction SilentlyContinue
if (-not $homePortInUse) {
  Start-Process -FilePath "node.exe" `
    -ArgumentList "server.mjs" `
    -WorkingDirectory $homeRoot `
    -WindowStyle Hidden
}

$tunnelRunning = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -eq "cloudflared.exe" -and $_.CommandLine -match "tunnel run" }
if (-not $tunnelRunning) {
  Start-Process -FilePath "cloudflared.exe" `
    -ArgumentList "tunnel", "run", $tunnelId `
    -WorkingDirectory $projectRoot `
    -WindowStyle Hidden
}
