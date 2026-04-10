import React, { PureComponent } from 'react';
import _ from 'lodash';
import Select from 'components/Select';
import cs from './index.less';
import MultiLanguageInput from '../MultiLanguageInput';
import language from 'utils/language';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';

const DEFAULT_OPTIONS = [{ label: i18n['general.modify'], value: 'MODIFY' }];
const INIT_OPTION = { label: i18n['general.default_select'], value: '' };
const INIT_DATA = {
  fieldId: '', // 字段编号
  type: 'MODIFY', // 行为字段来源，写死为MODIFY
  message: {}
};

export class ConditionEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...this.updateConditions(props),
      lang: language.getLang(),
      options: this.updateOptions(props)
    };
  }

  updateConditions = nextProps => {
    const value = nextProps.value || [];
    if (!value.length) {
      value.push(INIT_DATA);
    }
    const fieldCount = this.updateFiledCount(value);
    return {
      conditions: value,
      fieldCount
    };
  };

  updateFiledCount = value => {
    const fieldCount = {};
    value.forEach(({ fieldId }) => {
      if (!fieldId) {
        return;
      }
      let count = fieldCount[fieldId] || 0;
      count++;
      fieldCount[fieldId] = count;
    });
    return fieldCount;
  };

  componentWillReceiveProps(nextProps) {
    let state = null;
    if (nextProps.value !== this.props.value) {
      state = this.updateConditions(nextProps);
      this.setState(state);
    }

    //update options
    if (
      nextProps.options !== this.props.options ||
      nextProps.selected !== this.props.selected ||
      nextProps.type !== this.props.type
    ) {
      const options = this.updateOptions(nextProps);
      const optionSet =
        options.reduce((target, { value }) => {
          if (!value) {
            return target;
          }
          target[value] = true;
          return target;
        }, {}) || {};
      let conditions = state ? state.conditions : this.state.conditions.concat();
      // if (nextProps.type !== this.props.type && !nextProps.isDefaultType) {
      conditions = conditions.map(el => (optionSet[el.fieldId] ? { ...el } : { ...el, fieldId: '' }));
      // }
      this.setState({ options, conditions });
    }
  }

  updateOptions = nextProps => {
    let options = nextProps.options.concat();
    const { selected, type } = nextProps;
    if (type === 'SECTION_PERMIT') {
      //部分选择
      options = options.filter(el => selected.indexOf(el.value) !== -1);
    } else if (type === 'SECTION_NOT_PERMIT') {
      //部分不选
      options = options.filter(el => selected.indexOf(el.value) === -1);
    }
    options.unshift(INIT_OPTION);
    return options;
  };

  componentWillMount() {
    const { onRegisterAdd } = this.props;
    if (onRegisterAdd) {
      onRegisterAdd(this.addField);
    }
  }

  checkInput = () => {
    const { conditions = [], fieldCount } = this.state;
    if (!conditions.length) {
      return false;
    }
    for (const item of conditions) {
      if (!item.fieldId || !item.message[this.state.lang]) {
        return false;
      }
      if (fieldCount[item.fieldId] > 1) {
        return false;
      }
    }
    return true;
  };

  addField = () => {
    const conditions = this.state.conditions.concat();
    conditions.push(INIT_DATA);
    this.setState({ conditions });
    this.notifyDataChanged(conditions);
  };

  execDelete = (index, close) => {
    const conditions = this.state.conditions.concat();
    conditions.splice(index, 1);
    this.setState({ conditions });
    this.notifyDataChanged(conditions);
    close();
  };

  onDelete = index => {
    const { showTipsModal } = this.props;
    showTipsModal({
      content: i18n['trader.account.profile.setting.deleteTips'],
      onConfirm: this.execDelete.bind(this, index)
    });
  };

  notifyDataChanged = data => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(data);
    }
  };

  onChangeField = (index, value) => {
    const conditions = this.state.conditions.concat();
    conditions[index] = {
      ...conditions[index],
      fieldId: value
    };
    const fieldCount = this.updateFiledCount(conditions);
    this.setState({ conditions, fieldCount });
    this.notifyDataChanged(conditions);
  };

  onChangeMessage = (index, message) => {
    const conditions = this.state.conditions.concat();
    conditions[index] = {
      ...conditions[index],
      message
    };
    this.setState({ conditions });
    this.notifyDataChanged(conditions);
  };

  renderItem = (item, index) => {
    const { options = [], conditions, fieldCount } = this.state;
    const { fieldId, type, message } = item;
    const { title, languages } = this.props;
    return (
      <div key={index} className={cs.item}>
        <div className={cs.title}>
          <FormattedMessage
            id="trader.account.profile.setting.condition"
            defaultMessage={i18n['trader.account.profile.setting.condition']}
            values={{ number: index + 1 }}
          />
          {conditions.length > 1 ? <i className="fa fa-trash-o" onClick={this.onDelete.bind(this, index)} /> : null}
        </div>
        <div className={cs.horizonSpan}>
          <FormattedMessage
            id="trader.account.profile.setting.fieldEdit"
            defaultMessage={i18n['trader.account.profile.setting.fieldEdit']}
            values={{
              c1: (
                <Select searchable onChange={this.onChangeField.bind(this, index)} value={fieldId} options={options} />
              ),
              c2: <Select disabled value={type} options={DEFAULT_OPTIONS} />
            }}
          />
          {!!fieldId ? null : <span className={cs.error}>{i18n['trader.account.profile.setting.selectField']}</span>}
        </div>
        {fieldCount[fieldId] > 1 ? (
          <span className={cs.error}>{i18n['trader.account.profile.setting.fieldDuplicate']}</span>
        ) : null}
        {i18n['trader.account.profile.setting.content']}
        <MultiLanguageInput
          languages={languages}
          onChange={this.onChangeMessage.bind(this, index)}
          value={message}
          title={title}
        />
        {!!message[this.state.lang] ? null : (
          <span className={cs.error}>
            <FormattedMessage
              id="validate.required"
              defaultMessage={i18n['validate.required']}
              values={{ value: title }}
            />
          </span>
        )}
      </div>
    );
  };

  render() {
    const { conditions } = this.state;
    return <div>{conditions && conditions.length && conditions.map(this.renderItem)}</div>;
  }
}

export default ConditionEdit;
