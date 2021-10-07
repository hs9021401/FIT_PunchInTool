# Check permission for executing ps1 script
$permission = Get-ExecutionPolicy
Write-Host "Powershell Permission: "$permission
if( $permission -ne "RemoteSigned" ) {
    Write-Host "### Warning: You have no permission to execute the script. Please follow the instrctions below: ###" -ForegroundColor red -BackgroundColor white
    Write-Host "`t1. Run Powershell as Administrator" -ForegroundColor red -BackgroundColor white
    Write-Host "`t2. Type 'Set-ExecutionPolicy RemoteSigned' and key 'Y' " -ForegroundColor red -BackgroundColor white
    Write-Host "`t3. Type 'Get-ExecutionPolicy'. Check if 'RemoteSigned' displayed." -ForegroundColor red -BackgroundColor white
    break STOPSCRIPT
}

$tool_filename = "app.js"
$tool_folder = $PSScriptRoot
$PARAM_ToolPath = Join-Path $tool_folder $tool_filename
$chromeDriverVer_filename = "chromeDriverVer.config"
$chromeDriver_filePath = Join-Path $tool_folder $chromeDriverVer_filename

# Get current Google Chrome version
$PARAM_ChromeVer = (Get-Item 'C:\PROGRA~2\Google\Chrome\Application\chrome.exe').VersionInfo.FileVersion
Write-Host "Google Chrome Version:"$PARAM_ChromeVer

# Get current Google Chrome driver version
$PARAM_ChromeDriverVer = Get-Content -Path $chromeDriver_filePath 
Write-Host "Selenium for Google Chrome Driver Version:"$PARAM_ChromeDriverVer

# Get Authentication Information
$auth_filename = "auth.config"
$auth_filePath = Join-Path $tool_folder $auth_filename
$Auth_Info = Get-Content -Path $auth_filePath

$PARAM_Auth = $Auth_Info.Split(" ")

node $PARAM_ToolPath $PARAM_Auth[0] $PARAM_Auth[1] $PARAM_ChromeVer $PARAM_ChromeDriverVer
