$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$Port = 5173
$Url = "http://localhost:$Port"

function Test-PortOpen {
  param([int] $PortToCheck)

  try {
    $client = [System.Net.Sockets.TcpClient]::new()
    $connect = $client.BeginConnect("127.0.0.1", $PortToCheck, $null, $null)
    $connected = $connect.AsyncWaitHandle.WaitOne(250, $false)
    if ($connected) {
      $client.EndConnect($connect)
    }
    $client.Close()
    return $connected
  } catch {
    return $false
  }
}

if (-not (Test-PortOpen -PortToCheck $Port)) {
  Start-Process powershell.exe -WorkingDirectory $ProjectRoot -ArgumentList @(
    "-NoExit",
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-Command",
    "npm run dev -- --host 127.0.0.1"
  )

  Start-Sleep -Seconds 3
}

Start-Process $Url
