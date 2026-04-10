import React from 'react';
import { VCenterSelectField } from '../VCenterSelectField';
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';

let hintDefaultStyle = {
  paddingLeft: fontSizeByDPR(73),
  fontSize: fontSizeByDPR(28)
}
let labelDefaultStyle = {
  paddingLeft: fontSizeByDPR(63),
  backgroundSize: `${fontSizeByDPR(38)} ${fontSizeByDPR(38)}`,
  backgroundRepeat: 'no-repeat',
  backgroundPositionX: 0,
  backgroundPositionY: '50%'
}
let selectedMenuItemStyle = {
  color: "#00a3fe"
}

export function IconSelectField(props) {
  let copiedProps = Object.assign({}, props);
  let iconSrc = copiedProps.iconSrc;
  let labelDefaultStyleWithIcon = iconSrc ? Object.assign({}, labelDefaultStyle, { backgroundImage: `url("${iconSrc}")` }) : labelDefaultStyle;
  let ls = Object.assign({}, labelDefaultStyleWithIcon, props.labelStyle);
  let hs = Object.assign({}, hintDefaultStyle, props.hintStyle);

  delete copiedProps.iconSrc;

  return (
    <VCenterSelectField
      { ...copiedProps }
      hintStyle={ hs }
      labelStyle={ ls }
      selectedMenuItemStyle={ selectedMenuItemStyle }
    >
      { props.children }
    </VCenterSelectField>
  )
}