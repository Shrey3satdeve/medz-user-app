$SdkRoot='C:\Users\shrey\AppData\Local\Android\Sdk'
$ndk='ndk;25.1.8937393'
$ndkPath=Join-Path $SdkRoot 'ndk\25.1.8937393'
if(Test-Path $ndkPath){ Write-Host "Removing existing incomplete NDK at $ndkPath"; Remove-Item -Recurse -Force $ndkPath }
else{ Write-Host "NDK folder not present, continuing" }
$paths = @(
    Join-Path $SdkRoot 'cmdline-tools\latest\bin\sdkmanager.bat',
    Join-Path $SdkRoot 'tools\bin\sdkmanager.bat',
    Join-Path $SdkRoot 'cmdline-tools\bin\sdkmanager.bat',
    'sdkmanager.bat',
    'sdkmanager'
)
$found = $paths | Where-Object { Test-Path $_ } | Select-Object -First 1
if(-not $found){ Write-Host 'sdkmanager not found in common locations. Will try sdkmanager on PATH'; $found = 'sdkmanager' }
Write-Host "Using sdkmanager: $found"
& "$found" $ndk
& "$found" --licenses -v
Write-Host 'NDK install/accept completed'

# run gradle clean
if(Test-Path "..\android\gradlew"){
    Write-Host 'Running gradlew clean'
    Push-Location "..\android"
    .\gradlew clean
    Pop-Location
} else {
    Write-Host 'gradlew not found, skipping gradle clean'
}

Write-Host 'Now run: npx react-native run-android --verbose --stacktrace'