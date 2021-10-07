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
$tool_folder = (Get-Location)
$tool_path = Join-Path $tool_folder $tool_filename
$chromeDriverVer_filename = "chromeDriverVer.config"
$chromeDriver_filePath = Join-Path $tool_folder $chromeDriverVer_filename

# Get current Google Chrome version
$chrome_ver = (Get-Item 'C:\PROGRA~2\Google\Chrome\Application\chrome.exe').VersionInfo.FileVersion
Write-Host "Google Chrome Version:"$chrome_ver

# Get current Google Chrome driver version
$chromeDriver_ver = Get-Content -Path $chromeDriver_filePath 
Write-Host "Selenium for Google Chrome Driver Version:"$chromeDriver_ver

node $tool_path 你的帳號 你的密碼 $chrome_ver $chromeDriver_ver
