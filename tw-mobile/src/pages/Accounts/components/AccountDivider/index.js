import React from 'react';
import Divider from 'material-ui/Divider';

let style = {
  marginRight: '15px',
  backgroundColor: '#ededed'
}

export function AccountDivider() {
  return (
    <Divider
      inset={ true }
      style={ style }
    />
  );
}
