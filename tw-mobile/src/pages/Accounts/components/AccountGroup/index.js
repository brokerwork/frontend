import React from 'react';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import { AccountDivider } from '../AccountDivider';
import { pxToRem } from '../../../../utils/styleUtils';
import css from './accountGroup.less';
import i18n from 'utils/i18n'
// enums
import { IsAppendAccount } from 'enums/isAppendAccount';

const AVATAR_DATA_URL = "http://broker-upload.oss-cn-hangzhou.aliyuncs.com/test/a2d130ee-8262-46de-ad66-da6cda9be7b8.png"

let listStyle = {
  borderTop: `1px solid #ededed`,
  borderBottom: `1px solid #ededed`,
  backgroundColor: 'white',
  padding: '0',
  marginTop: pxToRem(20)
}
let addNewAcctPrimaryTextStyle = {
  position: 'relative',
  top: '7px'
}
let propTypes = {
  accounts: React.PropTypes.array,
  isLive: React.PropTypes.bool,
	avata: React.PropTypes.string
};
let defaultProps = {
  accounts: []
};
let avatarStyle = {
  width: pxToRem(90),
  overflow: 'hidden',
  height: pxToRem(90),
  borderRadius: '50%',
}
let imgStyle = {
  top: '50%',
  width: '100%',
  position: 'absolute',
  transform: 'translateY(-50%)',
}

let addIcon = require('images/icon_addaccount@3x.png');
let bindIcon = require('images/icon_bind account@2x.png')
class AccountGroup extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  }
  constructor(props) {
    super(props)
  }

  handleTouchTap = ( acct ) => {
		let {onAccountTap} = this.props;
		onAccountTap && onAccountTap(acct)
  }

  renderAvatar = (src) => { 
    return <div style={avatarStyle}>
      <img src={src} style={imgStyle}/>
    </div>
  }

  renderListItem() {
    let els = [];
    let { accounts, onTouchTap, visible, accountType, structuralList, openDialog } = this.props;
    let logo = {}
    let vendor = ''
    if (structuralList && structuralList.length){ 
      structuralList.forEach((item) => { 
        logo[item.structural] = item.basicSetting.structuralLogo
      })
    }
    //<Avatar src={logo[acct.vendor]} />
    let len = accounts.length;
    for (let i = 0; i < len; i++) {
      let acct = accounts[i];
      if (i === 0) {
        els.push(<ListItem
          key={acct.account}
          primaryText={acct.vendor}
          onTouchTap={()=>{this.handleTouchTap(acct)}}
          leftAvatar={this.renderAvatar(logo[acct.vendor])}
          secondaryText={
            <div className={css['account-metas']}>
              <span className={css['meta']}>{i18n['fundflow.column.common.accountId']}：{acct.account}</span>
              <span className={css['meta']}>{i18n['mobile.balance.key']}: {acct.balance}</span>
              <span className={css['meta']}>{acct.currency}</span>
            </div>
          }
        />);
      } else {
        els.push(<AccountDivider key={i} />)
        els.push(<ListItem
          key={acct.account}
          insetChildren
          primaryText={acct.vendor}
          onTouchTap={()=>{this.handleTouchTap(acct)}}
          secondaryText={
            <div className={css['account-metas']}>
              <span className={css['meta']}>{i18n['fundflow.column.common.accountId']}：{acct.account}</span>
              <span className={css['meta']}>{i18n['mobile.balance.key']}: {acct.balance}</span>
              <span className={css['meta']}>{acct.currency}</span>
            </div>
          }
        />)
      }
    }
    els.push(<AccountDivider key="header-divider" />)
    if (visible){ 
      els.push(<ListItem key={"add"}
        primaryText={<div style={addNewAcctPrimaryTextStyle}>{i18n['mobile.add.account.key']}</div>}
        secondaryText=" "
        leftAvatar={<Avatar src={addIcon} />}
        onTouchTap={this._onAddNewAccount.bind(this, accounts[0].vendor)}
      />);
      els.push(<AccountDivider key="header-divider2" />)
      if (accountType == 'live'){ 
        els.push(<ListItem key={"live"}
          primaryText={<div style={addNewAcctPrimaryTextStyle}>{i18n['mobile.bind.account']}</div>}
          secondaryText=" "
          leftAvatar={<Avatar src={bindIcon} />}
          onTouchTap={this.toBindAccount.bind(this, accounts[0].vendor)}
        />)
      }
    }
    return els;
  }


  toBindAccount = (vendor) => { 
    this.context.router.push(`/accounts/bindAccount/${vendor}`)
  }
  _onAddNewAccount = (vendor, event) => {
    event.preventDefault()
    if (this.props.isLive) {
      const { openDialog } = this.props
      openDialog && openDialog(IsAppendAccount.True)
      //  获取快速、常规开户开关
      // fastOpenAble(vendor).then((res) => {
      //   if (res && res.payload && res.payload.data) {
      //     return this.context.router.push(`/accounts/open/real/${IsAppendAccount.True}`);
      //   } else {
      //     return this.context.router.push(`/accounts/openAcct/${vendor}`)
      //   }
      // })
    } else { 
      this.context.router.push('/accounts/open/mock');
    }
  }
  render() {
    return (
      <List style={listStyle}>
        {
          this.renderListItem()
        }
      </List>
    );
  }
}

AccountGroup.propTypes = propTypes;
AccountGroup.defaultProps = defaultProps;

export { AccountGroup };
