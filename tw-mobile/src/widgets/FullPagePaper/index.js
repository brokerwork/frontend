import React from 'react';
import { ScrollableFullPageWrapper } from 'widgets/ScrollableFullPageWrapper';
import Paper from 'material-ui/Paper';
import { pxToRem } from 'utils/styleUtils';

let paperDefaultStyle = {
  width: '100%',
  padding: pxToRem( 30 ),
  borderRadius: pxToRem( 6 ),
  flexGrow: 1
}

let scrollContentDefaultStyle = {
  display: 'flex',
  minHeight: '100%',
  boxSizing: 'border-box',
  padding: pxToRem( 30 ),
  alignItems: 'stretch'
}
/*
  propTypes = {
    style: React.PropTypes.object,
    paperStyle: React.PropTypes.object
  }
*/
export function FullPagePaper( props ) {
  let {
    style,
    paperStyle
  } = props;

  let cs = Object.assign( {}, scrollContentDefaultStyle, style );
  let pStyle = Object.assign( {}, paperDefaultStyle, paperStyle )
  return (
    <ScrollableFullPageWrapper
      contentStyle={ cs }
    >
      <Paper style={ pStyle }>
      {
        props.children
      }
      </Paper>
    </ScrollableFullPageWrapper>
  );
} 

