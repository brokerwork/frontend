import React from 'react';
import css from './ScrollableFullPageWrapper.less';
/* ------------------- main -------------------- */

let wrapperDefaultStyle = {
  width: '100%',
  height: '100%'
}

let contentDefaultStyle = {
  width: '100%'
}
/*
  propTypes = {
    wrapperStyle: React.PropTypes.object,
    contentStyle: React.PropTypes.object
  };
*/
export function ScrollableFullPageWrapper( props ) {
  let {
    wrapperStyle,
    contentStyle
  } = props;
  let ws = Object.assign( {}, wrapperDefaultStyle, wrapperStyle );
  let cs = Object.assign( {}, contentDefaultStyle, contentStyle );
  return (
    <div
      id="wrapper"
      style={ ws }
    >
      <div style={ cs }>
        { props.children }
      </div>
    </div>
  );
}