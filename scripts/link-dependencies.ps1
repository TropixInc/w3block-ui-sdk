Write-Host "Criando links com mklink..." -ForegroundColor Green

$mainProject = "../w3block-connect-front"
$currentDir = Get-Location

if (Test-Path $mainProject) {
    Write-Host "Removendo links existentes..." -ForegroundColor Yellow
    
    Push-Location $mainProject
    
    if (Test-Path "node_modules/@w3block/w3block-ui-sdk") {
        Remove-Item "node_modules/@w3block/w3block-ui-sdk" -Force -Recurse
    }
    
    if (-not (Test-Path "node_modules/@w3block")) {
        New-Item -ItemType Directory -Path "node_modules/@w3block" -Force
    }
    
    Pop-Location
    
    Write-Host "Criando link do SDK..." -ForegroundColor Yellow
    $targetPath = "$mainProject\node_modules\@w3block\w3block-ui-sdk"
    $sourcePath = $currentDir
    
    cmd /c "mklink /J `"$targetPath`" `"$sourcePath`""
    
    Push-Location $mainProject
    if (Test-Path "node_modules/@w3block/w3block-ui-sdk") {
        Write-Host "Link criado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "Erro ao criar link" -ForegroundColor Red
    }
    Pop-Location
    
} else {
    Write-Host "Projeto principal nao encontrado" -ForegroundColor Red
}