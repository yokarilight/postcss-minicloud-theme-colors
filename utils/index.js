const normalizeCSS = (css) => css.replace(/\s+/g, '').trim();

function isColor(str) {
  // check the color is hex
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (hexPattern.test(str)) {
    return true;
  }

  // check the color is rgba
  const rgbaPattern = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/;
  if (rgbaPattern.test(str)) {
    const rgbaValues = rgbaPattern.exec(str).slice(1, 4).map(Number);
    return rgbaValues.every(value => value >= 0 && value <= 255);
  }

  // check the color is rgb
  const rgbPattern = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  if (rgbPattern.test(str)) {
    const rgbValues = rgbPattern.exec(str).slice(1, 4).map(Number);
    return rgbValues.every(value => value >= 0 && value <= 255);
  }

  return false;
}

module.exports = {
  normalizeCSS,
  isColor,
};
