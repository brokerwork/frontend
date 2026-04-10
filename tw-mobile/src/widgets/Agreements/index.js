// libs
import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import { pxToRem, transformRemToPx } from '../../utils/styleUtils';
// css
import css from './agreements.less';
/* ------------------ main --------------------- */

let styles = {
  wrapper: {
    position: 'relative',
    overflow: 'hidden'
  },
  checkboxWrapper: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  item: {
    textDecoration: 'none',
    color: '#00a3fe'
  },
  checkbox: {
    left: '-3px'
  },
  iconStyle: {
    marginRight: pxToRem( 15 )
  },
  text: {
    float: 'left',
    marginLeft: `${25+transformRemToPx(pxToRem( 15 ))}px`,
    lineHeight: '24px'
  }
}

const DEFAULT_ITEM_PLACEHOLDER = '{{ITEM}}';

function textToArray( text, itemPlaceholder=DEFAULT_ITEM_PLACEHOLDER ) {
  if ( text ) {
    return text.split( itemPlaceholder );
  } else {
    return [];
  }
}

function renderItem( item ) {
  if ( item ) {
    return <a key={item.text}
            href="javascript:void(0);"
            style={ styles.item }
            onTouchTap={ item.onTouchTap }
          >{ item.text }</a>
  }
}

function renderText( textArray, items=[] ) {
  let result = [];
  let text = textArray.shift();
  while( text ) {
    result.push( text );
    let item = items.shift();
    if ( item ) {
      result.push( renderItem(item) )
    }
    text = textArray.shift();
  }
  return result;
}

/*
  propTyps = {
    checked: React.PropTypes.bool,
    onCheck: React.PropTypes.func,
    itemPlaceholder: React.PropTypes.string,
    text: React.PropTypes.string, 声明文字的模版'xxxxx{{ITEM}},XXXXX{{ITEM}}'，其中有连接的文字使用{{ITEM}}作为占位符，用下面 items 相关参数设定连接文字
    items: React.PropTypes.array 
          [ {
            text: React.PropTypes.string,
            onTouchTap: React.PropTypes.func
          } ]
  }
*/
export function Agreements( props ) {
  let {
    checked,
    onCheck,
    text,
    itemPlaceholder,
    items
  } = props;

  let textArray = textToArray( text, itemPlaceholder );
  let textAndItems = renderText( textArray, items );
  return (
    <div style={ styles.wrapper }>
      <div style={ styles.checkboxWrapper }>
        <Checkbox
          className={ css['checkbox'] }
          style={ styles.checkbox }
          labelStyle={ styles.labelStyle }
          iconStyle={ styles.iconStyle }
          checked={ checked }
          onCheck={ function(...args){
            if ( onCheck ) onCheck( ...args ); 
          } }
        />
      </div>
      <span style={ styles.text }>
        { textAndItems }
      </span>
    </div>
    
  );
}