export function hashCode(input: string): number {
  let hash = 0;

  for (let i = 0; i < input.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + input.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash &= hash;
  }

  return hash;
}
