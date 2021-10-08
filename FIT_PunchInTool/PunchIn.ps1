###
# Author: Alex Lin
###

# Variables
$TOOL_FOLDER = $PSScriptRoot
$TOOL_FILENAME = "app.js"
$PARAM_ToolPath = Join-Path $TOOL_FOLDER $TOOL_FILENAME
$CONFIG_FOLDER = Join-Path $TOOL_FOLDER "config" 
$CONFIG_FILENAME_ChromeDriverVer = "chromeDriverVer.config"
$CONFIG_FILENAME_Auth = "auth.config"
$FILEPATH_Auth = Join-Path $CONFIG_FOLDER $CONFIG_FILENAME_Auth
$FILEPATH_ChromeDriver = Join-Path $CONFIG_FOLDER $CONFIG_FILENAME_ChromeDriverVer

# Set environment variables
# 檢查環境變數是否存在
$punchInEnvVar = [System.Environment]::GetEnvironmentVariable("PunchIn", "User")
Write-Output "Env:"$punchInEnvVar
if ( $null -eq $punchInEnvVar ) {
    Write-Host "Setting environment variables..."
	# Set 環境變數
	[Environment]::SetEnvironmentVariable("PunchIn", $TOOL_FOLDER, "User")
	# Load 環境變數
	$env:Path = [System.Environment]::GetEnvironmentVariable("PunchIn", "User")
} else {
    Write-Host "Environment virables set already."
}

# Check permission for executing ps1 script
$permission = Get-ExecutionPolicy
Write-Host "Powershell Permission: "$permission
if( $permission -ne "RemoteSigned" ) {
    Write-Host "### Warning: You have no permission to execute the script. Please follow the instrctions below: ###" -ForegroundColor red -BackgroundColor white
    Write-Host "`t1. Run Powershell as Administrator" -ForegroundColor red -BackgroundColor white
    Write-Host "`t2. Type 'Set-ExecutionPolicy RemoteSigned' and key 'Y' " -ForegroundColor red -BackgroundColor white
    Write-Host "`t3. Type 'Get-ExecutionPolicy'. Check if 'RemoteSigned' displayed." -ForegroundColor red -BackgroundColor white
    break STOPSCRIPT #break 任一個不存在的值 -> 不繼續進行script
}

# Get current Google Chrome version
$PARAM_ChromeVer = (Get-Item 'C:\PROGRA~2\Google\Chrome\Application\chrome.exe').VersionInfo.FileVersion
Write-Host "Google Chrome Version:"$PARAM_ChromeVer

# Get current Google Chrome driver version
$PARAM_ChromeDriverVer = Get-Content -Path $FILEPATH_ChromeDriver 
Write-Host "Selenium for Google Chrome Driver Version:"$PARAM_ChromeDriverVer

# Get Authentication Information
$Auth_Info = Get-Content -Path $FILEPATH_Auth
$PARAM_Auth = $Auth_Info.Split(" ")

# Run node script
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine")+ ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
node $PARAM_ToolPath $PARAM_Auth[0] $PARAM_Auth[1] $PARAM_ChromeVer $PARAM_ChromeDriverVer
