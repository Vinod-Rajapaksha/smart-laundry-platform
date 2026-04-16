export function generateOrderNo(): string {
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');

  const randomPart = randomUppercase(4);

  return `ORD-${yyyy}${mm}${dd}-${randomPart}`;
}

export function generateBankReference(): string {
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');

  const randomPart = randomUppercase(4);

  return `REF-${yyyy}${mm}${dd}-${randomPart}`;
}

function randomUppercase(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let out = '';

  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    out += chars[idx];
  }

  return out;
}