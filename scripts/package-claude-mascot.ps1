$ErrorActionPreference = 'Stop'
$taskProjectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$taskAssetRoot = Join-Path $taskProjectRoot 'public/mascot'
$taskPackPath = Join-Path $taskAssetRoot 'claude-mascot-svg-pack.zip'
$taskPackFiles = @(Get-ChildItem -LiteralPath $taskAssetRoot -Filter '*.svg' | ForEach-Object { $_.FullName })
$taskStateCount = $taskPackFiles.Count
$taskPackFiles += @(
    (Join-Path $taskAssetRoot 'manifest.json'),
    (Join-Path $taskAssetRoot 'README.md'),
    (Join-Path $taskAssetRoot 'index.html')
)
$taskPackFiles += @(Get-ChildItem -LiteralPath (Join-Path $taskAssetRoot 'reference') -File | ForEach-Object { $_.FullName })
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression
$taskStream = [System.IO.File]::Open($taskPackPath, [System.IO.FileMode]::Create)
$taskArchive = [System.IO.Compression.ZipArchive]::new($taskStream, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($taskFile in $taskPackFiles) {
        $taskEntryName = $taskFile.Substring($taskAssetRoot.Length + 1).Replace('\', '/')
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($taskArchive, $taskFile, $taskEntryName, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
} finally {
    $taskArchive.Dispose()
    $taskStream.Dispose()
}
Write-Output "Packaged $taskStateCount states and the four reference exports."
