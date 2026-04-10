import i18n from 'utils/i18n';
import CardPanel from 'components/v2/CardPanel';
import Points from 'landings/Points';
import cs from './UpdateUserCard.less';
import { getRights } from './utils';
import MainPanel from '../../containers/UpdateUserPanel';
import { Button } from 'lean-ui';
import {
  USER_FORM_USER_INFO,
  USER_FORM_REAK_RULE,
  USER_FORM_AGENCT_INFO,
  USER_FORM_ACCOUNT_INFO
} from './MainPanel';

let serverId = null;
let vendor = null;

export default class UpdateUserCard extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { getUserInfo, clearUserInfo, match, type } = this.props;
    let copyData = {};
    // 编辑时获取用户信息
    Promise.resolve(clearUserInfo()).then(() => {
      if (type === 'edit') {
        const userId = match.params.userId;
        getUserInfo(userId);
      }
    });
    // // 新增 获取默认参数
    // getDefaultParams();
  }

  addCommissionInitValue = () => {
    const { upwardInitvalue, type } = this.props;

    const commissionUserInfo = {};
    if (type === 'add') {
      commissionUserInfo['levelId'] = 0;
      commissionUserInfo['levelName'] = null;
      commissionUserInfo['parent'] = 0;
      return commissionUserInfo;
    }

    return upwardInitvalue.commissionInitValues || {};
  };

  onClose = () => {
    const { type, onHide, parentUrl } = this.props;

    if (type === 'edit') {
      this.props.history.push(parentUrl);
    } else if (onHide) {
      onHide();
    }
  };
  onSubmitDone = submitData => {
    const { onSubmitUserInfo, params, getListData, bindCtid } = this.props;
    onSubmitUserInfo(submitData).then(({ result, data }) => {
      if (!result) return;
      // 绑定 ctid
      if (submitData['accountInfo-ctid'] && data && data.login) {
        bindCtid(data.login, submitData['accountInfo-ctid'], {
          vendor: submitData.vendor,
          serverId: submitData.serverId
        });
      }
      this.onClose();
      getListData(params);
    });
  };

  onSave = () => {
    const { submitForm } = this.props;
    submitForm(USER_FORM_USER_INFO);
    submitForm(USER_FORM_REAK_RULE);
    submitForm(USER_FORM_AGENCT_INFO);
    submitForm(USER_FORM_ACCOUNT_INFO);
  };

  render() {
    const {
      header,
      type,
      match,
      userRights,
      relationUserInfo,
      editUserInfo,
      versionRights,
      accountTypes,
      resetForm
    } = this.props;
    const rights = getRights(relationUserInfo, userRights);
    const basicShow =
      type === 'edit' ? rights.showBasicInfo : rights.addBasicInfo;
    const commissionShow =
      type === 'edit' ? rights.showCommissionInfo : rights.addCommissionInfo;
    return (
      <CardPanel
        show={true}
        onClose={this.onClose}
        className={cs['container']}
        title={header}
      >
        {type === 'edit' && (
          <Points
            style={{ marginLeft: 10, marginRight: 10 }}
            info={editUserInfo}
          />
        )}
        {type === 'add' || `${editUserInfo.id}` === `${match.params.userId}` ? (
          <div className={cs['main-panel']}>
            <MainPanel
              type={type}
              editUserInfo={editUserInfo}
              onSubmitUserInfo={this.onSubmitDone}
              match={match}
              versionRights={versionRights}
              accountTypes={accountTypes}
              resetForm={resetForm}
              // hideMoreForm={true} //暂时屏蔽用户中的额外字段
            />
          </div>
        ) : (
          undefined
        )}

        <CardPanel.Footer>
          <Button className={cs['button-cancel']} onClick={this.onClose}>
            {i18n['general.cancel']}
          </Button>
          {type === 'edit' &&
          ((rights.editBasicInfo && basicShow) ||
            (commissionShow && rights.editCommissionInfo)) ? (
            <Button type="primary" onClick={this.onSave}>
              {i18n['general.save']}
            </Button>
          ) : (
            undefined
          )}
          {type === 'add' && rights.addBasicInfo ? (
            <Button type="primary" onClick={this.onSave}>
              {i18n['general.save']}
            </Button>
          ) : (
            undefined
          )}
        </CardPanel.Footer>
      </CardPanel>
    );
  }
}
