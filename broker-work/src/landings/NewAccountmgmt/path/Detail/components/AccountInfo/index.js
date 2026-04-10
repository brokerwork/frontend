import { Button, Icon, Input } from 'lean-ui';
import Form, { ACCOUNT_INFO_FORM } from './Form';
import UserSelector from 'components/v2/UserSelector';
import cs from './AccountInfo.less';
import i18n from 'utils/i18n';
import { getType } from 'utils/language';
const lang = getType();
export default class AccountInfo extends PureComponent {
  state = {
    editable: false
  };

  disableEdit = () => {
    const { resetForm } = this.props;

    this.setState({
      editable: false
    });
    resetForm(ACCOUNT_INFO_FORM);
  };

  onSave = () => {
    const { submitForm } = this.props;

    submitForm(ACCOUNT_INFO_FORM);
  };

  onSubmit = values => {
    const {
      currentServer,
      updateAccountInfo,
      showTopAlert,
      onChange,
      onSingleFormSubmit
    } = this.props;
    const copyData = JSON.parse(JSON.stringify(values));

    if (copyData.userId) {
      copyData.userId = copyData.userId.value;
    }

    copyData.readOnly = parseInt(copyData.readOnly);
    copyData.enable = parseInt(copyData.enable);

    onSingleFormSubmit(
      ACCOUNT_INFO_FORM,
      updateAccountInfo(copyData, currentServer)
    );
    // return updateAccountInfo(copyData, currentServer);
    // .then(({ result }) => {
    //   if (result) {
    //     showTopAlert({
    //       bsStyle: 'success',
    //       content: i18n['general.modify_success']
    //     });
    //     this.setState({
    //       editable: false
    //     });
    //     onChange();
    //   }
    // });
  };

  fieldGenerator = () => {
    return {
      key: 'userSelector',
      factory: (input, disabled) => {
        return (
          <UserSelector
            searchByField
            searchPlaceHolder={i18n['account.user_selector.search.placehoder']}
            disabled={disabled}
            value={input.value}
            onSelect={input.onChange}
          />
        );
      }
    };
  };

  filterFields = () => {
    const {
      formColumns,
      filteredRights,
      currentServer: { vendor },
      accountInfo
    } = this.props;
    const fields = formColumns.accountInfo || [];
    const ignoreFields = [
      'login',
      'regdate',
      'password',
      'investorPassword',
      'userId',
      'userGroup'
    ];
    const fieldOption = {
      readonly: {
        leverage: true,
        currency: true,
        ctraderAccountType: true,
        totalMarginCalculationType: true,
        maxLeverage: true,
        group: !filteredRights.update.group,
        userGroup: !filteredRights.update.accountGroup,
        readOnly: !filteredRights.update.readOnly, // 交易状态
        enable: !filteredRights.update.enable // 登录状态
      }
    };

    if (!filteredRights.show.group) {
      ignoreFields.push('group');
    }

    if (!filteredRights.show.accountGroup) {
      ignoreFields.push('userGroup');
    }

    if (!filteredRights.show.accountGroup) {
      ignoreFields.push('userGroup');
    }
    if (!filteredRights.show.leverage) {
      ignoreFields.push('leverage');
    }
    // if (!accountInfo.leverage || accountInfo.leverage === 'undefined') {
    //   ignoreFields.push('leverage');
    // }

    return fields
      .filter(field => !ignoreFields.includes(field.key))
      .map(field => {
        return {
          ...field,
          fieldType: field.key === 'userId' ? 'userSelector' : field.fieldType,
          columns: 2,
          readonly: field.sensitive
            ? !filteredRights.update.sensitive
            : fieldOption.readonly[field.key] || field.readonly
        };
      });
  };

  formatterInfo = () => {
    const {
      accountInfo,
      currentServer: { vendor }
    } = this.props;
    const copyData = JSON.parse(JSON.stringify(accountInfo));
    const { user } = accountInfo;

    copyData.readOnly = copyData.readOnly == 1 ? '0' : '1';
    copyData.enable = `${copyData.enable}`;

    if (user) {
      copyData.userId = {
        label: `${user.name} (${user.roleName}/${user.entityNo})`,
        value: user.id
      };
    }

    return copyData;
  };
  filterRequiredCheckbox = (fields = []) => {
    const checkboxs = [];
    let i = 0;
    const _len = fields.length;
    while (i < _len) {
      const field = fields[i];
      if (
        field.fieldType === 'singleCheckbox' &&
        field.validateType &&
        field.validateType.required
      )
        checkboxs.push(field.key);
      i++;
    }
    return checkboxs;
  };
  accountTypeLabelGen = () => {
    const {
      versionRights,
      accountTypes,
      accountInfo,
      currentServer: { vendor }
    } = this.props;
    if (versionRights['SC_CUSTOM_ACCOUNT_TYPE']) {
      const cur = _.find(accountTypes[vendor], {
        value: accountInfo.customAccountType
      });
      if (cur) {
        return cur.label;
      }
      return '';
    }
    return '';
  };
  render() {
    const {
      formColumns = {},
      filteredRights,
      globalFormChange,
      changedFormArray
    } = this.props;
    const { editable } = this.state;
    const fields = this.filterFields();
    const info = this.formatterInfo();
    const checkboxList = this.filterRequiredCheckbox(fields);
    const accountTypeLabel = this.accountTypeLabelGen();
    return (
      <div className={cs['account-info']}>
        <div className={cs['header']}>
          <div className={cs['title']}>
            <Icon fontType="bw" icon="profile" className={`${cs['icon']}`} />
            {i18n['account.edit_account.account_info']}
          </div>
          {info.lastDate && (
            <span className={cs.lastDate}>
              {i18n['account.edit_account.account_info.last_login']}
              {info.lastDate}
            </span>
          )}
        </div>
        {accountTypeLabel ? (
          <div className={cs['account-type']}>
            <div className="lean-form-label">{i18n['account.detail.info.custom_account_type']}</div>
            <Input value={accountTypeLabel} disabled />
          </div>
        ) : null}
        <div className={cs['content']}>
          <Form
            fields={fields}
            initialValues={info}
            disabled={!filteredRights.update.accountInfo}
            onSubmit={this.onSubmit}
            checkboxList={checkboxList}
            fieldGenerator={this.fieldGenerator()}
            onFocus={() => {
              if (!changedFormArray.includes(ACCOUNT_INFO_FORM)) {
                globalFormChange(ACCOUNT_INFO_FORM);
              }
            }}
          />
        </div>
      </div>
    );
  }
}
