function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(r, g, b) {
  return `#${componentToHex(r) +
    componentToHex(g) +
    componentToHex(b)}`.toUpperCase();
}

export default function(colorStr) {
  const result = /rgb\((\s*?\d+\s*?,?\s*?)(\s*?\d+\s*?,?\s*?)(\s*?\d+\s*?,?\s*?)\)/.exec(
    colorStr
  );
  if (result) {
    const rgbArr = result.splice(1, 3).map(item => parseFloat(item));
    return rgbToHex(...rgbArr);
  }
  return colorStr;
}
