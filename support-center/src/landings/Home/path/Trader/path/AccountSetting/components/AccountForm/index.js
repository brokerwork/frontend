import React, { PureComponent } from 'react';
import Checkbox from 'components/Checkbox';
import RadioGroup from '../RadioGroup';
import MultiSelect from 'components/MultiSelect';
import MultiLanguageInput from '../MultiLanguageInput';
import cs from './index.less';
import Button from 'components/Button';
import ConditionEdit from '../ConditionEdit';
import language from 'utils/language';
import { TYPE_OPTIONS, INDICATOR_OPTIONS } from '../../constants';
import { FormattedMessage } from 'react-intl';
import i18n from 'utils/i18n';
import Switch from 'components/Switch';

class Section extends PureComponent {
  render() {
    const { children } = this.props;
    return <div className={cs.section}>{children}</div>;
  }
}
class Item extends PureComponent {
  render() {
    const { children, horizon, error, title } = this.props;
    return (
      <div>
        <div className={`${cs.item} ${horizon ? cs.horizon : cs.vec} ${title && cs.title}`}>{children}</div>
        {!!error ? <span className={cs.error}>{error}</span> : null}
      </div>
    );
  }
}

export class AccountForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected: [],
      defaultValue: {}
    };
  }

  fetchData = () => {
    const { getAccountProfile } = this.props;
    getAccountProfile().then(res => {
      if (!res.result) {
        return;
      }
      this.setState({ defaultValue: { ...res.data } });
    });
  };

  componentWillMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        data: nextProps.data
      });
    }
  }

  onChangedField = (key, value) => {
    const { changeField } = this.props;
    switch (key) {
      // case 'enableModifyAccount': {
      //   changeField(key, value.target.checked);
      //   break;
      // }
      case 'type': {
        changeField(key, value);
        break;
      }
      default: {
        if (value.target) {
          changeField(key, value.target.value);
        } else {
          changeField(key, value);
        }
        break;
      }
    }
  };

  onRegisterAdd = fn => {
    this.addNewField = fn;
  };

  onAddNew = () => {
    if (this.addNewField) {
      this.addNewField();
    }
  };

  saveData = data => {
    const { saveAccountProfile, showTopAlert } = this.props;
    saveAccountProfile(data).then(res => {
      if (!res.result) {
        showTopAlert({
          content: i18n['trader.account.profile.setting.saveFailure']
        });
        return;
      }
      showTopAlert({
        style: 'success',
        content: i18n['trader.account.profile.setting.success']
      });
    });
  };

  onSave = () => {
    const {
      setError,
      clearError,
      config: {
        profile: { indicator, enableModifyAccount, type, fieldIds = [] },
        profile
      }
    } = this.props;
    if (!enableModifyAccount) {
      this.saveData(profile);
      return;
    }
    let hasError = false;
    // if (!this.refs.message.checkInput()) {
    //   setError('message', i18n['trader.account.profile.setting.accountPageTips']);
    //   hasError = true;
    // } else {
    //   clearError('message');
    // }
    if (type !== 'ALL_PERMIT' && !fieldIds.length) {
      hasError = true;
    }
    if (indicator === 'CONDITION') {
      const success = this.refs.editList.checkInput();
      if (!success) {
        setError('indicator', i18n['trader.account.profile.setting.conditionTips']);
        return;
      } else {
        clearError('indicator');
      }
    } else if (indicator === 'NONE') {
      if (!this.refs.submitMessage.checkInput()) {
        setError('submitMessage', i18n['trader.account.profile.setting.commitTips']);
        return;
      } else {
        clearError('submitMessage');
      }
    }
    if (hasError) {
      return;
    }
    this.saveData(profile);
  };

  onReset = () => {
    this.fetchData();
  };

  render() {
    const {
      config: { loading, profile },
      initFields = [],
      errorMap = {},
      showTipsModal,
      languages
    } = this.props;
    const { defaultValue } = this.state;
    if (loading) {
      return null;
    }
    if (!profile['enableModifyAccount']) {
      return (
        <div className={cs.body}>
          <Section>
            <Item title horizon>
              {i18n['trader.account.profile.setting.allowModify']}
              <Switch
                checked={profile['enableModifyAccount']}
                onChange={this.onChangedField.bind(this, 'enableModifyAccount')}
              />
            </Item>
            <Item error={errorMap['message']}>
              <div className={cs.innerTitle}>{i18n['trader.account.profile.setting.profile.tips']}</div>
              <MultiLanguageInput
                ref="message"
                onChange={this.onChangedField.bind(this, 'message')}
                value={profile['message'] || {}}
                title={i18n['trader.account.profile.setting.accountPage']}
                maxLength={500}
                languages={languages}
              />
            </Item>
            <Item horizon>
              <Button style="primary" onClick={this.onSave}>
                {i18n['general.save']}
              </Button>
              <Button onClick={this.onReset}>{i18n['trader.account.profile.setting.reset']}</Button>
            </Item>
          </Section>
        </div>
      );
    }
    return (
      <div className={cs.body}>
        <Section>
          <Item horizon title>
            {i18n['trader.account.profile.setting.allowModify']}
            <Switch
              checked={profile['enableModifyAccount']}
              onChange={this.onChangedField.bind(this, 'enableModifyAccount')}
            />
          </Item>
          <Item>
            <div className={cs.innerTitle}>{i18n['trader.account.profile.setting.profile.tips2']}</div>
            <RadioGroup
              onChange={this.onChangedField.bind(this, 'type')}
              value={profile['type']}
              options={TYPE_OPTIONS}
              horizon
            />
          </Item>
          {profile.type === 'ALL_PERMIT' ? null : (
            <Item error={profile['fieldIds'].length ? '' : i18n['trader.account.profile.setting.selectField']}>
              <MultiSelect
                canPick
                value={profile['fieldIds']}
                onChange={this.onChangedField.bind(this, 'fieldIds')}
                searchable
                options={initFields}
              />
            </Item>
          )}
        </Section>
        <Section>
          <Item>
            <div className={cs.innerTitle}>{i18n['trader.account.profile.setting.commitTipsLabel']}</div>
          </Item>
          <Item>
            <div className={cs.darkColor}>{i18n['trader.account.profile.setting.conditionLabel']}</div>
          </Item>
          <Item horizon>
            <RadioGroup
              horizon
              onChange={this.onChangedField.bind(this, 'indicator')}
              value={profile['indicator']}
              options={INDICATOR_OPTIONS}
            />
            {profile['indicator'] === 'CONDITION' ? (
              <Button onClick={this.onAddNew} style="primary">
                {i18n['trader.account.profile.setting.addCondition']}
              </Button>
            ) : null}
          </Item>
          {profile['indicator'] === 'NOT_NONE' ? null : profile['indicator'] === 'CONDITION' ? (
            <Item>
              <ConditionEdit
                options={initFields}
                selected={profile['fieldIds']}
                type={profile['type']}
                onRegisterAdd={this.onRegisterAdd}
                onChange={this.onChangedField.bind(this, 'conditions')}
                value={profile['conditions']}
                isDefaultType={profile['type'] === defaultValue['type']}
                ref="editList"
                showTipsModal={showTipsModal}
                languages={languages}
              />
            </Item>
          ) : (
            <Item error={errorMap['submitMessage']}>
              {i18n['trader.account.profile.setting.content']}
              <MultiLanguageInput
                ref="submitMessage"
                onChange={this.onChangedField.bind(this, 'submitMessage')}
                value={profile['submitMessage']}
                languages={languages}
                maxLength={500}
              />
              {/* {!!profile['submitMessage'][language.getLang()] ? null : (
                <span className={cs.error}>
                  <FormattedMessage
                    id="validate.required"
                    defaultMessage={i18n['validate.required']}
                    values={{ value: i18n['trader.account.profile.setting.content'] }}
                  />
                </span>
              )} */}
            </Item>
          )}
        </Section>
        <Section>
          <Item error={errorMap['message']}>
            <div className={cs.innerTitle}>{i18n['trader.account.profile.setting.accountPage']}</div>
            <MultiLanguageInput
              ref="message"
              onChange={this.onChangedField.bind(this, 'message')}
              value={profile['message'] || {}}
              languages={languages}
              maxLength={500}
            />
          </Item>
          <Item horizon>
            <Button style="primary" onClick={this.onSave}>
              {i18n['general.save']}
            </Button>
            <Button onClick={this.onReset}>{i18n['trader.account.profile.setting.reset']}</Button>
          </Item>
        </Section>
      </div>
    );
  }
}

export default AccountForm;
