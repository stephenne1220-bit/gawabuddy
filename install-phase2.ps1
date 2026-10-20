$ErrorActionPreference = "Stop"
Write-Host "Writing Phase 2 files..." -ForegroundColor Cyan

function Write-File($path, $content) {
    $dir = Split-Path $path -Parent
    if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
    Set-Content -Path $path -Value $content -Encoding UTF8
    Write-Host "Created: $path" -ForegroundColor Green
}

Write-File "src/types/transaction.ts" @'
export type TxType = 'income' | 'expense' | 'transfer'
export interface Transaction {
  id: string
  user_id: string
  account_id: string
  category_id: string | null
  type: TxType
  amount_cents: number
  date: string
  note: string | null
  merchant: string | null
  transfer_to_account_id: string | null
  created_at: string
}
export type TxInput = Omit<Transaction, 'id' | 'user_id' | 'created_at'> & { id?: string }
export interface TxFilters {
  from?: string
  to?: string
  categoryId?: string
  type?: TxType
  accountId?: string
}
