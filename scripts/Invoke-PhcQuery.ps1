# Executa uma consulta de LEITURA na BD PHC (Aromas da Tarde).
# Lê as credenciais do .env na raiz do repo. BD real — apenas SELECTs.
#
# Uso:
#   .\scripts\Invoke-PhcQuery.ps1 -Query "select top 5 ref, design from st (nolock)"
#   .\scripts\Invoke-PhcQuery.ps1 -QueryFile .\sql\artigos.sql

param(
    [string]$Query,
    [string]$QueryFile
)

$ErrorActionPreference = 'Stop'

if (-not $Query -and -not $QueryFile) { throw "Indique -Query ou -QueryFile." }
if ($QueryFile) { $Query = Get-Content -Raw -Path $QueryFile }

if ($Query -notmatch '^\s*(--[^\r\n]*\r?\n|\s)*select\b') {
    throw "Apenas consultas SELECT são permitidas (BD de produção)."
}

$envFile = Join-Path $PSScriptRoot '..\.env'
$vars = @{}
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([A-Z0-9_]+)\s*=\s*([^#]*)') {
        $vars[$Matches[1]] = $Matches[2].Trim()
    }
}

foreach ($k in 'PHC_DB_HOST','PHC_DB_PORT','PHC_DB_NAME','PHC_DB_USER','PHC_DB_PASSWORD') {
    if (-not $vars[$k]) { throw "Variável $k em falta no .env" }
}

$connString = "Server=$($vars.PHC_DB_HOST),$($vars.PHC_DB_PORT);Database=$($vars.PHC_DB_NAME);User Id=$($vars.PHC_DB_USER);Password=$($vars.PHC_DB_PASSWORD);TrustServerCertificate=True;Connect Timeout=15"

$conn = New-Object System.Data.SqlClient.SqlConnection $connString
try {
    $conn.Open()
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = $Query
    $cmd.CommandTimeout = 60
    $adapter = New-Object System.Data.SqlClient.SqlDataAdapter $cmd
    $table = New-Object System.Data.DataTable
    [void]$adapter.Fill($table)
    $table
}
finally {
    $conn.Close()
}
