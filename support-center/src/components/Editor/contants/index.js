import { DefaultDraftBlockRenderMap } from 'draft-js';
export const COLORS = [
  '#000000',
  '#993300',
  '#333300',
  '#003300',
  '#003366',
  '#000080',
  '#333399',
  '#333333',
  '#800000',
  '#FF6600',
  '#808000',
  '#008000',
  '#008080',
  '#0000FF',
  '#666699',
  '#808080',
  '#FF0000',
  '#FF9900',
  '#99CC00',
  '#339966',
  '#33CCCC',
  '#3366FF',
  '#800080',
  '#999999',
  '#FF00FF',
  '#FFCC00',
  '#FFFF00',
  '#00FF00',
  '#00FFFF',
  '#00CCFF',
  '#993366',
  '#C0C0C0',
  '#FF99CC',
  '#FFCC99',
  '#FFFF99',
  '#CCFFCC',
  '#CCFFFF',
  '#99CCFF',
  '#CC99FF',
  '#FFFFFF'
];
export const FONT_SIZES = ['12', '13', '18', '24', '32'];
export const FONT_FAMILIES = [
  '宋体',
  '微软雅黑',
  '黑体',
  '楷体',
  '幼圆',
  'Arial',
  'Arial Black',
  'Times New Roman',
  'Verdana'
];
let CUSTOM_INLINE_STYLES = {};

COLORS.forEach(color => {
  CUSTOM_INLINE_STYLES[`FONT_COLOR_${color}`] = { color };
});

FONT_SIZES.forEach(fontSize => {
  CUSTOM_INLINE_STYLES[`FONT_SIZE_${fontSize}`] = { fontSize };
});

FONT_FAMILIES.forEach(fontFamily => {
  CUSTOM_INLINE_STYLES[`FONT_FAMILY_${fontFamily}`] = { fontFamily };
});

export const CUSTOM_STYLES_MAP = {
  ...CUSTOM_INLINE_STYLES
};

export const CUSTOM_BLOCK_MAP = {
  textAlign: ['left', 'right', 'center']
};

export const BLOCK_DOM_MAP = {};
DefaultDraftBlockRenderMap.forEach((item, name) => {
  BLOCK_DOM_MAP[item.element] = name;
  if (item.aliasedElements) {
    BLOCK_DOM_MAP[item.aliasedElements] = name;
  }
});
