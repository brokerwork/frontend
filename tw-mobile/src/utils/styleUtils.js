export function pxToRem( num ) {
  return (num / 75) + 'rem';
}

export function fontSizeByDPR( size ) {
  let dpr = document.documentElement.getAttribute( 'data-dpr' ) || '1';
  dpr = parseInt( dpr );
  return size / 2 * dpr + 'px';
}

export function transformRemToPx( num ) {
  num = parseFloat( num );
  if ( isNaN(num) ) return NaN;

  let rootFontsize = document.documentElement.style.fontSize;
  rootFontsize = parseFloat( rootFontsize );
  if ( isNaN(rootFontsize) ) return NaN;

  return num * rootFontsize;
}

export function transformRemToPxWithUnit( num ) {
  let r = transformRemToPx( num );
  return isNaN( r ) ? '' : r+'px';
}

