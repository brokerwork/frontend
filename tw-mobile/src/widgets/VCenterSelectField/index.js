import React from 'react';
import SelectField from 'material-ui/SelectField';
import { pxToRem } from 'utils/styleUtils';
import { combineComponentStyle } from '../utils';
import { createVCenterComponent } from '../createVCenterComponent';

const DEFAULT_HEIGHT = '72px';

// style
function generateDefaultStyle( height=DEFAULT_HEIGHT ) {
  return {
    height,
    lineHeight: height
  }
}
// menuStyle
function generateDefaultMenuStyle() {
  return { marginTop:0 }
}
// labelStyle
function generateDefaultLabelStyle( height=DEFAULT_HEIGHT ) {
  return {
    top: 0,
    marginTop:0,
    lineHeight: height,
    height: '100%'
  }
}
// iconStyle
function generateDefaultIconStyle() {
  return {
    top:'50%',
    marginTop: '-24px'
  }
}
// underlineStyle
function generateDefaultUnderlineStyle() {
  return { 
    bottom:0,
    borderColor: '#ededed' 
  }
}
// floatingLabelStyle
function generateDefaultFloatingLabelStyle() {
  return {
    top:'50%',
    marginTop:'-11px'
  }
}
// hintStyle
function generateDefaultHintStyle() {
  return { bottom:0 }
}
// errorStyle
function generateDefaultErrorStyle() {
  return { bottom: '-2px' }
}
//
function generateDefaultUnderlineDisabledStyle() {
  return { borderBottom: '1px solid #ededed', borderColor:'#ededed'}
}

let defaultStyleGeneratorMap = {
  style: (props)=>generateDefaultStyle(props.height),
  menuStyle: (props)=>generateDefaultMenuStyle(props.height),
  labelStyle: (props)=>generateDefaultLabelStyle(props.height),
  iconStyle: (props)=>generateDefaultIconStyle(props.height),
  underlineStyle: (props)=>generateDefaultUnderlineStyle(props.height),
  floatingLabelStyle: (props)=>generateDefaultFloatingLabelStyle(props.height),
  hintStyle: (props)=>generateDefaultHintStyle(props.height),
  errorStyle: props=>generateDefaultErrorStyle(props.height),
  underlineDisabledStyle: props=>generateDefaultUnderlineDisabledStyle(props.height)
}
/*
  propTypes = {
    height: React.PropTypes.string
  }
*/
let VCenterSelectField = createVCenterComponent( SelectField, defaultStyleGeneratorMap );
export { VCenterSelectField };