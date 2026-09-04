// 1rem = 16px
export function pxToRem(px: number | string) {
  const num = typeof px === 'string' ? parseFloat(px) : px
  return (num / 16) + 'rem'
}