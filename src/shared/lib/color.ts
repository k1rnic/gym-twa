export const alpha = (color: string, opacity: number) =>
  `color-mix(in srgb, ${color} ${opacity * 100}%, transparent)`;

export const lighten = (color: string, amount: number) =>
  `color-mix(in srgb, ${color} ${(1 - amount) * 100}%, white)`;

export const darken = (color: string, amount: number) =>
  `color-mix(in srgb, ${color} ${(1 - amount) * 100}%, black)`;
