$basePath = "c:\Users\Armando Solis\OneDrive\Documents\UNA\2026\Progra IV\Examen final\SGC"
$javaSrc = Join-Path $basePath "caballeriza-backend\src\main\java\com\caballeriza"

$repoFiles = @(
    "$javaSrc\repository\CaballoRepository.java",
    "$javaSrc\repository\EmpleadoRepository.java",
    "$javaSrc\repository\ReservaRepository.java",
    "$javaSrc\repository\RegistroMedicoRepository.java"
)

$serviceFiles = @(
    "$javaSrc\service\CaballoService.java",
    "$javaSrc\service\EmpleadoService.java",
    "$javaSrc\service\ReservaService.java",
    "$javaSrc\service\RegistroMedicoService.java",
    "$javaSrc\service\impl\CaballoServiceImpl.java",
    "$javaSrc\service\impl\EmpleadoServiceImpl.java",
    "$javaSrc\service\impl\ReservaServiceImpl.java",
    "$javaSrc\service\impl\RegistroMedicoServiceImpl.java"
)

foreach ($file in $repoFiles) {
    New-Item -ItemType File -Force -Path $file | Out-Null
}

foreach ($file in $serviceFiles) {
    New-Item -ItemType File -Force -Path $file | Out-Null
}

Write-Host "Service and Repository files created!"
