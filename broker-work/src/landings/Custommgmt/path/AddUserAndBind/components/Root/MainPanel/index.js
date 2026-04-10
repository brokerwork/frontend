import { isPositiveNumber } from 'utils/validate';
import { reduxForm } from 'redux-form';
import i18n from 'utils/i18n';
import { setTrimString } from 'utils/trim';
import { Button, Panel } from 'react-bootstrap';
import CardPanel from 'components/CardPanel';
import { post, get } from 'utils/ajax';
import { FormattedMessage } from 'react-intl';
import cs from '../UpdateUserCard.less';
import { FormControl } from 'react-bootstrap';
import Dropdown from 'components/Dropdown';
import { getRights, getVendorServer } from '../utils';
import UserInfo, { USER_FORM_USER_INFO as userFormUserInfo } from './UserInfo';
import RuleInfo, { USER_FORM_REAK_RULE as userFormReakRule } from './RuleInfo';
import AgencyInfo, {
  USER_FORM_AGENCT_INFO as userFormAgenctInfo
} from './AgencyInfo';
import CommissionAccount, {
  USER_FORM_ACCOUNT_INFO as userFormAccountInfo
} from './CommissionAccount';
import Checkbox from 'components/Checkbox';
import _ from 'lodash';
import { Card } from 'lean-ui';
export const USER_FORM_REAK_RULE = userFormReakRule;
export const USER_FORM_USER_INFO = userFormUserInfo;
export const USER_FORM_AGENCT_INFO = userFormAgenctInfo;
export const USER_FORM_ACCOUNT_INFO = userFormAccountInfo;

const REAK_FIELDS = ['parent', 'levelId', 'commission', 'levelName'];
export default class UpdateUserPanel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      readyShowInfo: false,
      isCommissionFormAdd: !!this.props.editUserInfo.login,
      commissionAccountOp: this.props.isTask
        ? this.props.editUserInfo.commissionAccountOp
        : this.props.editUserInfo.login
          ? 'Bind'
          : 'NotBind'
    };
  }

  __submitData = {};
  __errors = [];
  __errorTimer = 0;
  submit = data => data;
  submitFail = errors => {
    const { showTopAlert } = this.props;
    for (let k in errors) {
      if (errors[k]) this.__errors.push(errors[k]);
    }
    if (this.__errorTimer) {
      clearTimeout(this.__errorTimer);
    }
    this.__errorTimer = setTimeout(() => {
      this.__errorTimer = 0;
      if (this.__errors.length > 0) {
        showTopAlert({
          content: (
            <ul>
              {this.__errors.map((item, index) => {
                return <li key={index}>{item}</li>;
              })}
            </ul>
          ),
          bsStyle: 'danger'
        });
        this.__errors = [];
      }
    }, 10);
    this.__submitData = {};
  };

  submitSuccess(field, data) {
    const {
      onSubmitUserInfo,
      relationUserInfo,
      userRights,
      type,
      moreFormColumns,
      basicFormColumns,
      checkSameLogin,
      showTipsModal,
      isTask
    } = this.props;
    const { isCommissionFormAdd } = this.state;
    const rights = getRights(relationUserInfo, userRights, isTask);
    const basicShow =
      type === 'edit' ? rights.showBasicInfo : rights.addBasicInfo;
    const commissionShow =
      type === 'edit' ? rights.showCommissionInfo : rights.addCommissionInfo;

    const copyData = _.cloneDeep(data);
    if (field === 'commissionInfo') {
      basicFormColumns.concat(moreFormColumns).forEach(item => {
        delete copyData[item.key];
      });
      REAK_FIELDS.forEach(fieldKey => {
        delete copyData[fieldKey];
      });
    } else if (field === 'moreInfo') {
      basicFormColumns.forEach(item => {
        delete copyData[item.key];
      });
      REAK_FIELDS.forEach(fieldKey => {
        delete copyData[fieldKey];
      });
    }
    this.__submitData[field] = copyData;
    let formLength = 1;
    if (basicShow && commissionShow) {
      formLength++;
    }
    if (moreFormColumns.length) {
      formLength++;
    }
    if (isCommissionFormAdd) {
      formLength++;
    }
    if (Object.keys(this.__submitData).length === formLength) {
      let handledData = this.submitDataHandle(this.__submitData);
      const checkLogin = handledData['login'] && handledData['login'];
      const userId = (handledData['id'] && handledData['id']) || '';
      const commissionAccountOp = handledData['commissionAccountOp'];

      if (checkLogin && commissionAccountOp === 'Bind') {
        checkSameLogin(checkLogin, userId).then(({ result, data }) => {
          if (result) {
            if (data) {
              showTipsModal({
                content: (
                  <div className={cs['delete-tips-content']}>
                    <i
                      className={`fa fa-exclamation-triangle ${
                        cs['delete-tips-icon']
                      }`}
                    />
                    {i18n['usermgmt.usercard.login_repeat_info']}
                  </div>
                ),
                header: i18n['usermgmt.usercard.login_repeat_confirm'],
                onConfirm: cb => {
                  onSubmitUserInfo(handledData);
                  if (isTask) return;
                  cb();
                }
              });
            } else {
              onSubmitUserInfo(handledData);
            }
          }
        });
      } else {
        onSubmitUserInfo(handledData);
      }

      // 将数据给到外部接收函数后，清除记录的数据。
      // 防止外部点取消时，取到未更新的数据
      this.__submitData = {};
    }
  }

  submitDataHandle = data => {
    const { reakInput, isTask } = this.props;
    const { commissionAccountOp } = this.state;
    const commissionInputData = [];
    let finallyData = data['userInfo'] || {};
    let originReakData = {};
    if (data['reakrule']) {
      originReakData = data['reakrule'];
      if (originReakData['levelId'] && `${originReakData['levelId']}` !== '0') {
        for (let tmp in originReakData) {
          const obj = { ruleId: tmp };
          if (reakInput.indexOf(parseInt(tmp)) !== -1) {
            obj['commissionValue'] = originReakData[tmp] || '0';
            commissionInputData.push(obj);
          }

          if (
            reakInput.indexOf(parseInt(tmp)) === -1 &&
            [
              'parent',
              'levelId',
              'subUserCount',
              'submitFinally',
              'id',
              'levelName'
            ].indexOf(tmp) === -1
          ) {
            obj['detailId'] = originReakData[tmp] || 0;
            commissionInputData.push(obj);
          }
        }
      }
      finallyData =
        data['userInfo'] ||
        JSON.parse(JSON.stringify(originReakData['submitFinally']));
      finallyData['parent'] =
        originReakData['parent'] === 0 ? '' : originReakData['parent'];
      finallyData['levelId'] = originReakData['levelId'];
      finallyData['levelName'] = originReakData['levelName'];
      finallyData['commission'] = { list: commissionInputData };
    }
    if (data['moreInfo']) {
      finallyData = Object.assign({}, finallyData, data['moreInfo']);
    }
    if (data['commissionInfo']) {
      finallyData = Object.assign({}, finallyData, data['commissionInfo']);
    }
    finallyData['commissionAccountOp'] = commissionAccountOp;
    finallyData['login'] = finallyData['login'] || '';
    if (commissionAccountOp === 'NotBind') {
      finallyData['login'] = '';
      finallyData['serverId'] = '';
    }
    finallyData['vendorServerId'] =
      finallyData['serverId'] && finallyData['vendor']
        ? `${finallyData['vendor']}_${finallyData['serverId']}`
        : '';
    for (let name in finallyData) {
      if (['password', 'email'].includes(name) && finallyData[name]) {
        finallyData[name] = setTrimString(finallyData[name]);
      }

      if (name === 'phones' && finallyData[name]['phone']) {
        finallyData[name]['phone'] = setTrimString(finallyData[name]['phone']);
      }
    }
    if (finallyData['userId']) {
      finallyData['userId'] = finallyData['userId'].label
        ? finallyData['userId'].value
        : finallyData['userId'];
    }
    // 任务页面里，敏感字段不提交
    if (isTask) {
      const fields = this.fields || [];
      fields.forEach(f => {
        if (f.readonly) {
          delete finallyData[f.key];
        }
      });
    }
    finallyData['isBind'] = finallyData['isBind'] || false;
    return finallyData;
  };
  isRoleEdit = () => {
    const { roleList, editUserInfo } = this.props;
    for (let i = 0; i < roleList.length; i++) {
      if (parseInt(roleList[i]['value']) === parseInt(editUserInfo.roleId)) {
        return i;
      }
    }
    return '-1';
  };

  getRoleName = () => {
    const { editUserInfo } = this.props;
    let roleOptions = [
      {
        label: editUserInfo.roleName,
        value: editUserInfo.roleId
      }
    ];
    return roleOptions;
  };

  formatSensitiveFields = data => {
    const { type, userRights, relationUserInfo, isTask } = this.props;
    const copyData = _.cloneDeep(data);
    const rights = getRights(relationUserInfo, userRights, isTask);
    return copyData.map(item => {
      return {
        ...item,
        fieldType:
          (type === 'edit' || isTask) &&
          item.sensitive &&
          item.fieldType === 'image' &&
          !rights.enabledSensitiveEditing
            ? 'text'
            : item.fieldType,
        readonly: isTask
          ? item.sensitive
            ? !rights.enabledSensitiveEditing || item.readonly
            : item.readonly
          : type === 'edit'
            ? item.sensitive
              ? !rights.enabledSensitiveEditing || item.readonly
              : rights.editBasicInfo
                ? item.readonly
                : !rights.editBasicInfo
            : false
      };
    });
  };

  formatterFields = () => {
    const {
      serverList,
      basicFormColumns,
      roleList,
      relationUserInfo,
      userRights,
      type,
      isTask
    } = this.props;
    const rights = getRights(relationUserInfo, userRights, isTask);
    const copyData = _.cloneDeep(basicFormColumns);
    const serverIdx = copyData.findIndex(col => col.key === 'vendorServerId');
    const roleIdx = copyData.findIndex(col => col.key === 'roleId');
    const levelIdx = copyData.findIndex(col => col.key === 'levelId');
    const parentIdx = copyData.findIndex(col => col.key === 'parent');
    const entityNoIdx = copyData.findIndex(col => col.key === 'entityNo');
    const loginIdx = copyData.findIndex(col => col.key === 'login');
    let newCopyData = this.formatSensitiveFields(copyData);

    if (loginIdx !== -1) {
      newCopyData[loginIdx] = {
        ...newCopyData[loginIdx],
        fieldType: 'mtSearch'
      };
    }

    if (serverIdx !== -1) {
      newCopyData[serverIdx] = {
        ...newCopyData[serverIdx],
        optionList: serverList
      };
    }

    if (roleIdx !== -1) {
      newCopyData[roleIdx] = {
        ...newCopyData[roleIdx],
        readonly:
          type === 'add'
            ? false
            : type === 'edit' && parseInt(this.isRoleEdit()) === -1
              ? true
              : !rights.editBasicInfo,
        optionList:
          type === 'edit' && parseInt(this.isRoleEdit()) === -1
            ? this.getRoleName()
            : roleList
      };
    }

    if (entityNoIdx !== -1) {
      newCopyData[entityNoIdx] = {
        ...newCopyData[entityNoIdx],
        readonly: type === 'edit',
        placeHolder: 'usermgmt.usercard.id_placeholder'
      };
    }

    if (levelIdx !== -1) {
      newCopyData.splice(levelIdx, 1);
    }

    if (parentIdx !== -1) {
      newCopyData.splice(newCopyData.findIndex(col => col.key === 'parent'), 1);
    }
    return newCopyData;
  };

  onSelecLogin = selected => {
    this.setState({
      login: selected
    });
  };

  clearLogin = () => {
    this.setState({
      login: {}
    });
  };

  onUserFormChange = data => {
    // const { userFormData } = this.state;
    // if (data.vendorServerId) {
    //   let arr = data.vendorServerId.split('_');
    //   vendor = arr[0];
    //   serverId = arr[1];
    // }
    // if (!data.vendorServerId) {
    //   vendor = null;
    //   serverId = null;
    // }
    // if (
    //   (data['vendorServerId'] &&
    //     userFormData['vendorServerId'] !== data['vendorServerId']) ||
    //   !data['vendorServerId']
    // ) {
    //   this.setState({
    //     login: {}
    //   });
    // }
    // this.setState({
    //   userFormData: data
    // });
  };
  componentDidMount() {
    const {
      basicFormColumns,
      getAccountDropdownData,
      accountDropdownData
    } = this.props;
    this.getRequireData();
  }
  componentWillReceiveProps(nextProps) {
    if (
      !Object.keys(this.props.editUserInfo).length &&
      Object.keys(nextProps.editUserInfo).length
    ) {
      this.setState({
        isCommissionFormAdd: !!nextProps.editUserInfo.login
      });
    }
  }
  componentWillUnmount() {
    const { clearUserInfo } = this.props;
    clearUserInfo();
  }

  getRequireData = () => {
    const {
      getFormColumns,
      getUserLevel,
      modifyParams,
      getPasswordStrength,
      getUserRole,
      getServerList,
      getUpdateUserLevel,
      isTask
    } = this.props;
    getFormColumns(isTask);
    getUserLevel().then(res => {
      if (!res.result) return Promise.resolve(res);
      getServerList();
      getUpdateUserLevel();
      getUserRole();
      getPasswordStrength();
    });
  };

  onIsComissionAccountOpenChange = isOpen => {
    this.setState({
      isCommissionFormAdd: isOpen !== 'NotBind',
      commissionAccountOp: isOpen
    });
  };
  render() {
    const { readyShowInfo } = this.state;
    const {
      levelList,
      showTopAlert,
      upwardForm,
      ruleDetail,
      getUpwardReturn,
      parentsList,
      editUserInfo,
      getParents,
      header,
      brandInfo,
      userRights,
      relationUserInfo,
      type,
      moreFormColumns,
      basicFormColumns,
      disabled,
      isTask,
      onServerChange,
      getLevelByUserId,
      userDisabled
    } = this.props;
    const rights = getRights(relationUserInfo, userRights, isTask);
    const basicShow =
      type === 'edit' ? rights.showBasicInfo : rights.addBasicInfo;
    const commissionShow =
      type === 'edit' ? rights.showCommissionInfo : rights.addCommissionInfo;
    const dataReady = Object.keys(editUserInfo).length || type === 'add';
    const fields = this.formatterFields();
    this.fields = fields;
    const moreFields = this.formatSensitiveFields(moreFormColumns);
    let reakHeader =
      brandInfo['mode'] !== 'DISTRIBUTION'
        ? i18n['usermgmt.card_header.reak_info']
        : i18n['usermgmt.card_header.multi_reak_info'];
    return (
      <div>
        {dataReady && basicShow ? (
          <Card className={cs['card-style']}>
            <h3 className={cs['form-title']}>
              {i18n['usermgmt.card_header.basic_info']}
            </h3>
            <UserInfo
              initialValues={editUserInfo}
              fields={fields}
              editUserInfo={editUserInfo}
              rights={rights}
              disabled={disabled || userDisabled}
              userDisabled={userDisabled}
              // fieldGenerator={fieldGenerator}
              onChange={this.onUserFormChange}
              onSubmit={this.submit}
              onSubmitFail={this.submitFail}
              onSubmitSuccess={this.submitSuccess.bind(this, 'userInfo')}
              type={type}
              getLevelByUserId={getLevelByUserId}
            />
          </Card>
        ) : (
          undefined
        )}
        {dataReady && basicShow && moreFormColumns.length ? (
          <Card className={cs['card-style']}>
            <h3 className={cs['form-title']}>
              {i18n['usermgmt.card_header.more_info']}
            </h3>
            <AgencyInfo
              initialValues={editUserInfo}
              fields={moreFields}
              onSubmit={this.submit}
              disabled={disabled || userDisabled}
              onSubmitSuccess={this.submitSuccess.bind(this, 'moreInfo')}
            />
          </Card>
        ) : (
          undefined
        )}
        {dataReady && commissionShow ? (
          <Card className={cs['card-style']}>
            <h3 className={cs['form-title']}>{reakHeader}</h3>
            <RuleInfo
              {...this.props}
              rights={rights}
              onSubmit={this.submit}
              onSubmitFail={this.submitFail}
              disabled={disabled || userDisabled}
              userDisabled={userDisabled} // 因为disabled并非直接使用， 传入一个优先级更高的disabled
              onSubmitSuccess={this.submitSuccess.bind(this, 'reakrule')}
            />
          </Card>
        ) : (
          undefined
        )}
        {dataReady && commissionShow ? (
          <Card className={cs['card-style']}>
            <h3 className={cs['form-title']}>
              {i18n['usermgmt.card_header.commission_account']}
            </h3>
            <CommissionAccount
              {...this.props}
              initialValues={editUserInfo}
              onSubmit={this.submit}
              rights={rights}
              onSubmitFail={this.submitFail}
              disabled={disabled}
              onServerChange={onServerChange}
              onIsComissionAccountOpenChange={
                this.onIsComissionAccountOpenChange
              }
              onSubmitSuccess={this.submitSuccess.bind(this, 'commissionInfo')}
            />
          </Card>
        ) : (
          undefined
        )}
      </div>
    );
  }
}
