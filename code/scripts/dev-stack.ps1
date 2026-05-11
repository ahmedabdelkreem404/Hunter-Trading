param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$ViteArgs
)

$ErrorActionPreference = 'Stop'

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$apiProcess = $null
$viteExitCode = 0
$apiPort = if ($env:HUNTER_API_PORT) { [int]$env:HUNTER_API_PORT } else { 8000 }
$apiBaseUrl = $null

function Write-DevLine {
    param(
        [string]$Prefix,
        [string]$Message
    )

    Write-Host "[$Prefix] $Message"
}

function Test-HunterApi {
    try {
        $response = Invoke-WebRequest -Uri "$apiBaseUrl/" -UseBasicParsing -TimeoutSec 2

        if ($response.StatusCode -ne 200) {
            return $false
        }

        $payload = $response.Content | ConvertFrom-Json
        return $payload.name -eq 'Hunter Trading API' -and $payload.status -eq 'ok'
    } catch {
        return $false
    }
}

function Test-PortInUse {
    param(
        [int]$Port
    )

    return [bool](Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
}

function Resolve-ApiPort {
    if ($env:HUNTER_API_PORT) {
        return [int]$env:HUNTER_API_PORT
    }

    $candidate = 8000
    while (Test-PortInUse -Port $candidate) {
        $candidate++
    }

    return $candidate
}

function Stop-WorkspaceDevServers {
    $escapedRoot = [Regex]::Escape($projectRoot)
    $workspaceProcesses = Get-CimInstance Win32_Process | Where-Object {
        $_.CommandLine -and (
            $_.CommandLine -match $escapedRoot -or
            ($_.Name -eq 'php.exe' -and $_.CommandLine -match 'router\.php')
        )
    }

    foreach ($processInfo in $workspaceProcesses) {
        if ($processInfo.ProcessId -eq $PID) {
            continue
        }

        if (
            $processInfo.CommandLine -match 'vite' -or
            $processInfo.CommandLine -match 'npm-cli\.js"\s+run\s+dev' -or
            $processInfo.CommandLine -match 'router\.php'
        ) {
            try {
                Stop-Process -Id $processInfo.ProcessId -Force -ErrorAction Stop
            } catch {
                # Ignore races where the dev process exited between lookup and stop.
            }
        }
    }
}

function Stop-Tree {
    param(
        [System.Diagnostics.Process]$Process
    )

    if (-not $Process) {
        return
    }

    try {
        if (-not $Process.HasExited) {
            taskkill /pid $Process.Id /t /f | Out-Null
        }
    } catch {
        # Ignore cleanup failures when processes are already gone.
    }
}

function Wait-ForApi {
    param(
        [int]$TimeoutSeconds = 10
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

    while ((Get-Date) -lt $deadline) {
        if (Test-HunterApi) {
            return $true
        }

        if ($apiProcess -and $apiProcess.HasExited) {
            throw "API server exited early with code $($apiProcess.ExitCode)."
        }

        Start-Sleep -Milliseconds 250
    }

    return $false
}

Push-Location $projectRoot

try {
    Write-DevLine 'dev' 'Stopping any previous Hunter Trading dev servers'
    Stop-WorkspaceDevServers
    Start-Sleep -Milliseconds 500

    $apiPort = Resolve-ApiPort
    $apiBaseUrl = "http://127.0.0.1:$apiPort"

    Write-DevLine 'dev' "Starting PHP API server on $apiBaseUrl"
    $apiProcess = Start-Process php -ArgumentList '-S', "127.0.0.1:$apiPort", 'router.php' -WorkingDirectory $projectRoot -PassThru -WindowStyle Hidden

    if (-not (Wait-ForApi)) {
        throw "API server did not become ready on port $apiPort."
    }

    Write-DevLine 'dev' 'Starting Vite dev server'
    $env:VITE_API_PROXY_TARGET = $apiBaseUrl
    & npm.cmd 'run' 'dev:web' '--' @ViteArgs
    $viteExitCode = $LASTEXITCODE
} finally {
    if ($apiProcess) {
        Stop-Tree $apiProcess
    }

    Pop-Location
}

exit $viteExitCode
