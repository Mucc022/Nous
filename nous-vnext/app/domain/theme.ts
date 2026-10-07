export const DEFAULT_ACCENT = '#25bf62';
export function accentPalette(hex: string) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error('请输入六位十六进制颜色，例如 #25bf62');
  const rgb = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16));
  const mix = (target: number, ratio: number) => '#' + rgb.map(value => Math.round(value * (1 - ratio) + target * ratio).toString(16).padStart(2, '0')).join('');
  const luminance = rgb.map(value => { const s = value / 255; return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4; });
  const light = luminance[0] * .2126 + luminance[1] * .7152 + luminance[2] * .0722;
  return { main: hex.toLowerCase(), soft: mix(255, .90), border: mix(255, .70), dark: mix(0, .64), hover: mix(0, .76), onMain: light > .179 ? '#151515' : '#ffffff' };
}
