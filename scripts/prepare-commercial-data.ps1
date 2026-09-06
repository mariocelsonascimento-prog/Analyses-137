param(
  [Parameter(Mandatory = $true)][string]$InputFile,
  [Parameter(Mandatory = $true)][string]$OutputFile
)

$ErrorActionPreference = 'Stop'
$culture = [Globalization.CultureInfo]::InvariantCulture
$work = Join-Path ([IO.Path]::GetTempPath()) ('analyses137-commercial-' + [guid]::NewGuid().ToString())
$zip = Join-Path $work 'source.zip'
$expanded = Join-Path $work 'xlsx'
New-Item -ItemType Directory -Path $work | Out-Null
Copy-Item -LiteralPath $InputFile -Destination $zip
Expand-Archive -LiteralPath $zip -DestinationPath $expanded

function Read-XmlUtf8([string]$Path) {
  return [xml][IO.File]::ReadAllText($Path, [Text.Encoding]::UTF8)
}

$shared = @()
$sharedPath = Join-Path $expanded 'xl\sharedStrings.xml'
if (Test-Path -LiteralPath $sharedPath) {
  $sharedXml = Read-XmlUtf8 $sharedPath
  foreach ($item in $sharedXml.sst.si) { $shared += $item.InnerText }
}

$book = Read-XmlUtf8 (Join-Path $expanded 'xl\workbook.xml')
$rels = Read-XmlUtf8 (Join-Path $expanded 'xl\_rels\workbook.xml.rels')

function Get-ColumnIndex([string]$Reference) {
  $letters = $Reference -replace '[^A-Z]', ''
  $index = 0
  foreach ($character in $letters.ToCharArray()) { $index = ($index * 26) + ([int]$character - [int][char]'A' + 1) }
  return $index - 1
}

function Read-Sheet([string]$Name) {
  $sheet = $book.workbook.sheets.sheet | Where-Object name -eq $Name
  $relId = $sheet.GetAttribute('id', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships')
  $target = ($rels.Relationships.Relationship | Where-Object Id -eq $relId).Target.TrimStart('/').Replace('/', '\')
  $xml = Read-XmlUtf8 (Join-Path $expanded $target)
  $rows = @($xml.worksheet.sheetData.row)
  $headers = @{}
  foreach ($cell in $rows[0].c) {
    $index = Get-ColumnIndex $cell.r
    $value = [string]$cell.v
    if ($cell.t -eq 's') { $value = $shared[[int]$value] }
    $headers[$index] = $value
  }
  $records = @()
  foreach ($row in $rows | Select-Object -Skip 1) {
    $record = [ordered]@{}
    foreach ($cell in $row.c) {
      $index = Get-ColumnIndex $cell.r
      $value = [string]$cell.v
      if ($cell.t -eq 's' -and $value -ne '') { $value = $shared[[int]$value] }
      elseif ($cell.t -eq 'inlineStr') { $value = $cell.is.InnerText }
      if ($headers.ContainsKey($index)) { $record[$headers[$index]] = $value }
    }
    $records += [pscustomobject]$record
  }
  return $records
}

function Number($Value) {
  if ([string]::IsNullOrWhiteSpace([string]$Value)) { return 0 }
  try { return [double]::Parse([string]$Value, $culture) }
  catch { throw "Valeur numérique invalide : '$Value'" }
}

function Excel-DateValue($Value) {
  $text = [string]$Value
  $serial = 0.0
  if ([double]::TryParse($text, [Globalization.NumberStyles]::Any, $culture, [ref]$serial)) { return [datetime]::FromOADate($serial) }
  return [datetime]::ParseExact($text, 'dd/MM/yyyy', $culture)
}

$salesRaw = Read-Sheet 'Ventes'
$sales = @($salesRaw | Group-Object Vente_ID | ForEach-Object { $_.Group | Select-Object -First 1 })
$clients = Read-Sheet 'Clients'
$products = Read-Sheet 'Produits'
$returns = Read-Sheet 'Retours'
$clientById = @{}; foreach ($client in $clients) { $clientById[$client.Client_ID] = $client }
$productById = @{}; foreach ($product in $products) { $productById[$product.Produit_ID] = $product }
$averagePriceByProduct = @{}
foreach ($group in ($sales | Where-Object { -not [string]::IsNullOrWhiteSpace($_.Prix_Unitaire) } | Group-Object Produit_ID)) {
  $averagePriceByProduct[$group.Name] = ($group.Group | ForEach-Object { Number $_.Prix_Unitaire } | Measure-Object -Average).Average
}
$returnsBySale = @{}; foreach ($return in $returns) {
  if (-not $returnsBySale.ContainsKey($return.Vente_ID)) { $returnsBySale[$return.Vente_ID] = @() }
  $returnsBySale[$return.Vente_ID] += $return
}

$rows = foreach ($sale in $sales) {
  $client = $clientById[$sale.Client_ID]
  $product = $productById[$sale.Produit_ID]
  $quantity = Number $sale.Quantite
  $unitPrice = Number $sale.Prix_Unitaire
  if ($unitPrice -le 0) { $unitPrice = $averagePriceByProduct[$sale.Produit_ID] }
  $discount = Number $sale.Remise_pct
  $purchasePrice = Number $product.Prix_Achat
  $revenue = $quantity * $unitPrice * (1 - $discount)
  $margin = $revenue - ($quantity * $purchasePrice)
  $saleReturns = @($returnsBySale[$sale.Vente_ID] | Where-Object { $null -ne $_ })
  $returnedQuantity = 0
  $reasons = @()
  $returnEvents = @()
  foreach ($return in $saleReturns) {
    $returnQuantity = Number $return.Quantite_Retour
    $returnedQuantity += $returnQuantity
    $reasons += $return.Motif
    $returnEvents += [pscustomobject]@{ reason = $return.Motif; quantity = $returnQuantity }
  }
  [pscustomobject][ordered]@{
    saleId = $sale.Vente_ID; date = (Excel-DateValue $sale.Date_Commande).ToString('yyyy-MM-dd'); year = (Excel-DateValue $sale.Date_Commande).Year
    client = $client.Client; region = $(if ($client.Region -eq 'IDF') { 'Île-de-France' } else { $client.Region }); segment = $client.Segment.Trim()
    product = $product.Produit; category = $(switch ($product.Categorie) { 'Reseau' { 'Réseau' } 'écrans' { 'Écrans' } default { $product.Categorie } }); supplier = $product.Fournisseur
    salesperson = $sale.Commercial; paymentStatus = $(if ($sale.Statut_Paiement -eq 'paye') { 'Payé' } else { $sale.Statut_Paiement })
    quantity = $quantity; unitPrice = [math]::Round($unitPrice, 2); discount = $discount
    revenue = $revenue; margin = $margin
    returnedQuantity = $returnedQuantity; returnReasons = $reasons; returns = $returnEvents
  }
}

$payload = [ordered]@{
  generatedAt = (Get-Date).ToString('yyyy-MM-dd')
  source = 'Entrainement_PowerBI_DataAnalyst.xlsx'
  scope = [ordered]@{ sales = $sales.Count; rawSales = $salesRaw.Count; removedDuplicates = $salesRaw.Count - $sales.Count; clients = $clients.Count; products = $products.Count; returns = $returns.Count }
  rows = $rows
}
$json = $payload | ConvertTo-Json -Depth 6 -Compress
$outputDirectory = Split-Path -Parent $OutputFile
if ($outputDirectory) { New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null }
[IO.File]::WriteAllText($OutputFile, $json, [Text.UTF8Encoding]::new($false))

$totalRevenue = ($rows | Measure-Object revenue -Sum).Sum
$totalMargin = ($rows | Measure-Object margin -Sum).Sum
$totalQuantity = ($rows | Measure-Object quantity -Sum).Sum
$totalReturns = ($rows | Measure-Object returnedQuantity -Sum).Sum
[pscustomobject]@{
  Sales = $sales.Count; Clients = $clients.Count; Products = $products.Count; ReturnRows = $returns.Count
  Revenue = [math]::Round($totalRevenue, 2); Margin = [math]::Round($totalMargin, 2)
  MarginRate = [math]::Round(100 * $totalMargin / $totalRevenue, 2)
  Quantity = $totalQuantity; Returned = $totalReturns; ReturnRate = [math]::Round(100 * $totalReturns / $totalQuantity, 2)
}
