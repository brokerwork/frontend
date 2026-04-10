import React from 'react';
import { combineComponentStyle } from './utils';

export function createVCenterComponent( ComponentClassName, defaultStyleGeneratorMap ) {
  return function (props) {
    let copiedProps = combineComponentStyle( props, defaultStyleGeneratorMap );

    return (
      <ComponentClassName {...copiedProps} >
        { props.children }
      </ComponentClassName>
    )
  }
}
