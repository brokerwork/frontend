import React from 'react';
import TextField from 'material-ui/TextField';
import { pxToRem } from 'utils/styleUtils';
import { combineComponentStyle } from '../utils';
import { createVCenterComponent } from '../createVCenterComponent';

const DEFAULT_HEIGHT = '48px';

// style
function generateDefaultStyle( height=DEFAULT_HEIGHT ) {
  return {
    height,
    lineHeight: height,
    fontSize: '1px'
  }
}
// errorStyle
function generateDefaultErrorStyle() {
  return { bottom: '-2px' }
}
// underlineStyle
function generateDefaultUnderlineStyle() {
  return { 
    bottom:0,
    borderColor: '#ededed'
  }
}
// hintStyle
function generateDefaultHintStyle() {
  return { bottom: 'auto' }
}
function generateDefaultUnderlineDisabledStyle() {
  return { borderBottom: '1px solid #ededed', borderColor:'#ededed'}
}	

let defaultStyleGeneratorMap = {
  style: (props)=>generateDefaultStyle(props.height),
  underlineStyle: (props)=>generateDefaultUnderlineStyle(props.height),
  hintStyle: (props)=>generateDefaultHintStyle(props.height),
  errorStyle: props=>generateDefaultErrorStyle(props.height),
  underlineDisabledStyle: props=>generateDefaultUnderlineDisabledStyle(props.height)
}
/*
  propTypes = {
    height: React.PropTypes.string
  }
*/
let VCenterTextField = createVCenterComponent( TextField, defaultStyleGeneratorMap );
export { VCenterTextField };