# Exports every .docx in public/templates to PDF with Microsoft Word (Windows).
# Usage: powershell -ExecutionPolicy Bypass -File scripts/docx-to-pdf.ps1
$dir = Join-Path $PSScriptRoot '..\public\templates' | Resolve-Path
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
  Get-ChildItem -Path $dir -Filter *.docx | ForEach-Object {
    $pdf = [System.IO.Path]::ChangeExtension($_.FullName, '.pdf')
    $doc = $word.Documents.Open($_.FullName, $false, $true)
    $doc.ExportAsFixedFormat($pdf, 17)
    $doc.Close($false)
    Write-Output ("exported " + $pdf)
  }
} finally {
  $word.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
