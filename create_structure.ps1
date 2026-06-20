$basePath = "c:\Users\Armando Solis\OneDrive\Documents\UNA\2026\Progra IV\Examen final\SGC"

# Backend
$backend = Join-Path $basePath "caballeriza-backend"
$javaSrc = Join-Path $backend "src\main\java\com\caballeriza"
$resources = Join-Path $backend "src\main\resources"
$testSrc = Join-Path $backend "src\test\java\com\caballeriza"

$backendDirs = @(
    "$javaSrc\config",
    "$javaSrc\controller",
    "$javaSrc\dto\request",
    "$javaSrc\dto\response",
    "$javaSrc\entity",
    "$javaSrc\repository",
    "$javaSrc\service\impl",
    "$javaSrc\security",
    "$javaSrc\exception",
    "$resources\db\migration",
    "$testSrc"
)

foreach ($dir in $backendDirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

$backendFiles = @(
    "$javaSrc\config\SecurityConfig.java",
    "$javaSrc\config\JwtConfig.java",
    "$javaSrc\config\OpenApiConfig.java",
    "$javaSrc\config\CorsConfig.java",
    "$javaSrc\controller\CaballoController.java",
    "$javaSrc\controller\EmpleadoController.java",
    "$javaSrc\controller\ReservaController.java",
    "$javaSrc\dto\CaballoDTO.java",
    "$javaSrc\entity\Caballo.java",
    "$javaSrc\entity\Empleado.java",
    "$javaSrc\entity\Reserva.java",
    "$javaSrc\entity\RegistroMedico.java",
    "$javaSrc\security\JwtUtil.java",
    "$javaSrc\security\JwtFilter.java",
    "$javaSrc\security\UserDetailsServiceImpl.java",
    "$javaSrc\exception\GlobalExceptionHandler.java",
    "$javaSrc\exception\ResourceNotFoundException.java",
    "$javaSrc\CaballerizaApplication.java",
    "$resources\application.yml",
    "$resources\db\migration\V1__init.sql",
    "$resources\db\migration\V2__seed.sql",
    "$backend\Dockerfile",
    "$backend\pom.xml"
)

foreach ($file in $backendFiles) {
    New-Item -ItemType File -Force -Path $file | Out-Null
}

# Frontend
$frontend = Join-Path $basePath "caballeriza-frontend"
$feSrc = Join-Path $frontend "src"
$feTests = Join-Path $frontend "src\tests"

$frontendDirs = @(
    "$feSrc\api",
    "$feSrc\components\ui",
    "$feSrc\components\layout",
    "$feSrc\pages\Caballos",
    "$feSrc\pages\Personal",
    "$feSrc\pages\Calendario",
    "$feSrc\pages\Alimentacion",
    "$feSrc\pages\Login",
    "$feSrc\context",
    "$feSrc\routes",
    "$feSrc\hooks",
    "$feTests"
)

foreach ($dir in $frontendDirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

$frontendFiles = @(
    "$feSrc\api\axiosClient.js",
    "$feSrc\api\caballoApi.js",
    "$feSrc\api\authApi.js",
    "$feSrc\context\AuthContext.jsx",
    "$feSrc\routes\PrivateRoute.jsx",
    "$feSrc\routes\RoleRoute.jsx",
    "$feSrc\hooks\useAuth.js",
    "$feSrc\hooks\usePagination.js",
    "$feSrc\App.jsx",
    "$frontend\Dockerfile",
    "$frontend\package.json"
)

foreach ($file in $frontendFiles) {
    New-Item -ItemType File -Force -Path $file | Out-Null
}

# Root files (like docker-compose.yml)
New-Item -ItemType File -Force -Path "$basePath\docker-compose.yml" | Out-Null

Write-Host "Structure created successfully!"
