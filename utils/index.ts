const normalizeCSS = (css: string) => css.replace(/\s+/g, '').trim();

const isColor = (color: string) => {
  // check the color is hex
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (hexPattern.test(color)) {
    return true;
  }

  // check the color is rgba
  const rgbaPattern = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/;
  if (rgbaPattern.test(color)) {
    const rgbaMatch = rgbaPattern.exec(color);
    if (rgbaMatch) {
      const rgbaValues = rgbaMatch.slice(1, 4).map(Number);

      return rgbaValues.every(value => value >= 0 && value <= 255);
    }
  }

  // check the color is rgb
  const rgbPattern = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  if (rgbPattern.test(color)) {
    const rgbMatch = rgbPattern.exec(color);
    if (rgbMatch) {
      const rgbValues = rgbMatch.slice(1, 4).map(Number);

      return rgbValues.every(value => value >= 0 && value <= 255);
    }
  }

  return false;
}

export {
  normalizeCSS,
  isColor,
}
