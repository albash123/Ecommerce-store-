export function addLine(lines, line) {
  if (line.stock <= 0) return lines;
  const existing = lines.find(item => item.variantId === line.variantId);
  const quantity = Math.min(50, line.stock, Math.max(1, Math.floor(line.quantity)) + (existing?.quantity || 0));
  return existing ? lines.map(item => item.variantId === line.variantId ? {...line, quantity} : item) : [...lines, {...line, quantity}];
}
export function setQuantity(lines, variantId, quantity) {
  return lines.map(line => line.variantId === variantId ? {...line, quantity: Math.min(50, line.stock, Math.max(0, Math.floor(quantity)))} : line).filter(line => line.quantity > 0);
}
export function selectVariant(variants, color, size) {
  return variants.find(variant => variant.active && variant.color === color && variant.size === size);
}

