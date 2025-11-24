# PowerShell script to explore your Supabase database tables
# Usage: .\explore-tables.ps1

Write-Host "=== Supabase Database Table Explorer ===" -ForegroundColor Green
Write-Host ""

# Database connection details
$DB_HOST = "db.mzojxrxkcizngvvntyho.supabase.co"
$DB_PORT = "5432"
$DB_NAME = "postgres"
$DB_USER = "postgres"

Write-Host "Connecting to database..." -ForegroundColor Yellow

# SQL queries to explore the database
$queries = @{
    "List all tables" = @"
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
"@

    "Table details with row counts" = @"
SELECT 
    t.table_name,
    t.table_type,
    COALESCE(s.n_tup_ins + s.n_tup_upd + s.n_tup_del, 0) as estimated_rows
FROM information_schema.tables t
LEFT JOIN pg_stat_user_tables s ON s.relname = t.table_name
WHERE t.table_schema = 'public'
ORDER BY t.table_name;
"@

    "Column information for all tables" = @"
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.is_nullable,
    c.column_default,
    c.character_maximum_length
FROM information_schema.tables t
JOIN information_schema.columns c ON c.table_name = t.table_name
WHERE t.table_schema = 'public'
ORDER BY t.table_name, c.ordinal_position;
"@

    "Foreign key relationships" = @"
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;
"@
}

# Check if psql is available
try {
    $psqlVersion = psql --version 2>$null
    if ($psqlVersion) {
        Write-Host "✓ psql is available" -ForegroundColor Green
        Write-Host ""
        
        foreach ($queryName in $queries.Keys) {
            Write-Host "=== $queryName ===" -ForegroundColor Cyan
            Write-Host ""
            
            # Create a temporary SQL file
            $tempFile = [System.IO.Path]::GetTempFileName() + ".sql"
            $queries[$queryName] | Out-File -FilePath $tempFile -Encoding UTF8
            
            # Execute the query
            $env:PGPASSWORD = Read-Host "Enter your database password" -AsSecureString | ConvertFrom-SecureString -AsPlainText
            psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $tempFile
            
            # Clean up
            Remove-Item $tempFile
            Write-Host ""
            Write-Host "Press any key to continue to next query..." -ForegroundColor Yellow
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
            Write-Host ""
        }
    } else {
        Write-Host "✗ psql is not available. Please install PostgreSQL client." -ForegroundColor Red
        Write-Host ""
        Write-Host "Alternative: Use the Node.js script:" -ForegroundColor Yellow
        Write-Host "node explore-db.js" -ForegroundColor White
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Quick Commands ===" -ForegroundColor Green
Write-Host "• Connect to database: psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME" -ForegroundColor White
Write-Host "• List tables: \dt" -ForegroundColor White
Write-Host "• Describe table: \d table_name" -ForegroundColor White
Write-Host "• List schemas: \dn" -ForegroundColor White
Write-Host "• Quit psql: \q" -ForegroundColor White
