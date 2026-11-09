export function normalizeBankAccount(value: string): string {
  const account = value.replace(/\s/g, '').toUpperCase();
  return /^\d{26}$/.test(account) ? `PL${account}` : account;
}

export function isValidBankAccount(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const account = normalizeBankAccount(value);
  if (!/^PL\d{26}$/.test(account)) return false;
  const digits = `${account.slice(4)}2521${account.slice(2, 4)}`;
  let remainder = 0;
  for (const digit of digits) remainder = (remainder * 10 + Number(digit)) % 97;
  return remainder === 1;
}
