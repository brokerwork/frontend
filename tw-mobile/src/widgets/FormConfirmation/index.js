// libs
import React from 'react';
import FlatButton from 'material-ui/FlatButton';
// widgets
import { Dialog } from 'widgets/Dialog';
// utils
import { pxToRem } from 'utils/styleUtils';
import i18n from 'utils/i18n'
/* --------------- main -------------------- */

const DEFAULT_OK_LABEL = i18n['tausermgmt.confirm'];
const DEFAULT_CANCEL_LABEL = i18n['tausermgmt.cancel'];

let styles = {
  dialogTitleStyle: {
    textAlign: 'center',
    borderBottomColor: 'transparent',
    height: pxToRem(140),
    lineHeight: pxToRem(140),
    borderTopLeftRadius: pxToRem(10),
    borderTopRightRadius: pxToRem(10)
  },
  fieldStyle: {
    height: pxToRem(103),
    borderBottom: '1px solid #ededed',
    display: 'flex',
    alignItems: 'center'
  },
  fieldNameStyle: {
    marginRight: pxToRem(10)
  },
  lastFieldStyle: {
    height: pxToRem(103),
    borderBottom: 'none',
    display: 'flex',
    alignItems: 'center'
  },
  bodyStyle: {
    paddingBottom: '0'
  }
}

function renderFormFields( formFields ) {
  if ( formFields ) {
    return formFields.map( (f,i) => {
      let s = (i === formFields.length - 1 ? styles.lastFieldStyle : styles.fieldStyle);
      return (
        <li key={i}>
          <div style={ s }>
          <span style={ styles.fieldNameStyle }>{ f.name + ':'}</span>
          <span>{ f.value }</span>
          </div>
        </li>
      );
    } )
  } else {
    return [];
  }
}

/*
  propTyps = {
    show: React.PropTypes.bool,
    title: React.PropTypes.string,
    okLabel: React.PropTypes.string,
    cancelLabel: React.PropTypes.string,
    onOK: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    formFields: React.PropTypes.object
              [ {
                name: React.PropTypes.string,
                value: React.PropTypes.string,
                type: React.PropTypes.string // 譬如要显示图片等非字符串的值，接口留着，暂时没有实现
              } ]
  }
*/
export function FormConfirmation( props ) {
  let {
    show,
    title,
    okLabel,
    cancelLabel,
    onOK,
    onCancel,
    formFields,
    contentStyle
  } = props;
  let actions = [
    <FlatButton
      key="cancel"
      onTouchTap={ onCancel }
      label={ cancelLabel||DEFAULT_CANCEL_LABEL }
    />,
    <FlatButton
      key="ok"
      onTouchTap={ onOK }
      label={ okLabel||DEFAULT_OK_LABEL }
      primary
    />
  ]
  return (
    <Dialog
      modal
      contentStyle={contentStyle}
      open={ show }
      title={ title }
      titlePadding="0"
      actions={ actions }
      autoScrollBodyContent
      titleStyle={ styles.dialogTitleStyle }
      bodyStyle={ styles.bodyStyle }
    >
      <ul>
      { renderFormFields( formFields ) }
      </ul>
    </Dialog>
  );
}