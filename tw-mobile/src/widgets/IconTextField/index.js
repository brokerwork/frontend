import React from 'react';
import { VCenterTextField } from '../VCenterTextField';
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';

let uTextId = 10;
let hintDefaultStyle = {
  paddingLeft: fontSizeByDPR(63),
  fontSize: fontSizeByDPR(28)
}

let inputDefaultStyle = {
  padding:`0 0 0 ${fontSizeByDPR(63)}`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPositionX: 0,
  backgroundPositionY: 'center',
  fontSize: fontSizeByDPR( 28 )
}

let underlineFocusStyle = {
	borderColor: "#00A3FE"
}

export function IconTextField(props) {
  let style = props.style
	let nextId = '' + uTextId++;
  let copiedProps = Object.assign( {}, {id: nextId}, props );
  let iconSrc = copiedProps.iconSrc;
  let inputDefaultStyleWidthIcon = iconSrc ? Object.assign( {}, inputDefaultStyle, {backgroundImage: `url("${iconSrc}")`} ) : inputDefaultStyle;
  let is = Object.assign( {}, inputDefaultStyleWidthIcon, props.inputStyle );
  let hs = Object.assign( {}, hintDefaultStyle, props.hintStyle );
  let us = Object.assign( {}, underlineFocusStyle, props.underlineFocusStyle );

  delete copiedProps.iconSrc;

  return (
    <VCenterTextField
      {...copiedProps}
      style={style}
      hintStyle= { hs }
      inputStyle={ is }
      underlineFocusStyle={ us }
    />
  )
}