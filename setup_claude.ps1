# 1. Prompt User for Inputs
Write-Host "--- Claude Code & Portkey Configuration Script ---" -ForegroundColor Cyan
$secureKey = Read-Host "Please enter your Portkey API Key" -AsSecureString
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
try { $apiKey = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr) } finally { [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
$classSlug = Read-Host "Please enter the class slug (e.g., i320d-biomedical-informatics)"
$modelInput = (Read-Host "Please enter the model that is enabled for your API KEY (e.g., haiku)").Trim()

# 2. Check/Install Claude
$claudeExists = Get-Command claude -ErrorAction SilentlyContinue
if (-not $claudeExists) {
    Write-Host "Installing Claude..." -ForegroundColor Yellow
    irm https://claude.ai/install.ps1 | iex
    $oldPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($oldPath -notlike "*$HOME\.local\bin*") {
        [Environment]::SetEnvironmentVariable("Path", "$oldPath;$HOME\.local\bin", "User")
    }
}

# 3. Clear Stale Sessions/Cache
Write-Host "Clearing stale Claude sessions..." -ForegroundColor Yellow
$cacheDir = "$env:AppData\claude-code\sessions"
if (Test-Path $cacheDir) { Remove-Item -Recurse -Force $cacheDir }

# 4. Create .claude.json with Double-Redundancy
$claudeConfig = @{
    "primaryAccountID"       = "portkey-user"
    "authManagementType"     = "none"
    "hasCompletedOnboarding" = $true
    "env"                    = @{
        "ANTHROPIC_BASE_URL"       = "https://api.portkey.ai/v1"
        "ANTHROPIC_AUTH_TOKEN"     = "dummy"
        "ANTHROPIC_CUSTOM_HEADERS" = "x-portkey-api-key: $apiKey`nx-portkey-provider: @$classSlug"
    }
    "claudeCode.defaultModel" = "$modelInput"
}

$configPath = "$HOME\.claude.json"
$claudeConfig | ConvertTo-Json -Depth 10 | Out-File -FilePath $configPath -Encoding utf8

Write-Host "RESTART POWERSHELL and type 'claude' to test." -ForegroundColor Red