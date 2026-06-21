$javaFiles = Get-ChildItem -Path "c:\Users\Armando Solis\OneDrive\Documents\UNA\2026\Progra IV\Examen final\SGC\caballeriza-backend\src\main\java" -Recurse -Filter *.java
foreach ($file in $javaFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $utf8NoBom = New-Object System.Text.UTF8Encoding($False)
    [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
}
Write-Host "BOM removed from all Java files."
