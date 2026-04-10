import React, { Component } from 'react';
import cs from './TaskDetails.less';
import i18n from 'utils/i18n';
import moment from 'moment';
class openAccountTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  formatAdd = (obj = {}) => {
    let country = JSON.parse(localStorage.getItem('COUNTRY'));
    let c = country.find(el => el.value === obj.country);
    let p = country.find(el => el.value === obj.province);
    let city = country.find(el => el.value === obj.city);
    return `${c && c.label} ${p && p.label} ${city && city.label}`;
  };
  formatCountry = value => {
    let country = JSON.parse(localStorage.getItem('COUNTRY'));
    let c = country.find(el => el.value === value);
    return `${c && c.label}`;
  };
  formatTin = (arr = []) => {
    return arr.map(el => el.tin).join('、');
  };
  renderLabel = (field, value) => {
    let label;
    if (!value) return '';
    switch (field.fieldType) {
      case 'select':
      case 'radio':
      case 'checkbox':
        label =
          field.optionList.find(el => el.value === value) &&
          field.optionList.find(el => el.value === value).label;
        break;
      case 'phone':
        label = value.phone || value.phoneStr;
        break;
      case 'city':
        label = this.formatAdd(value);
      case 'country':
        label = this.formatCountry(value);
        break;
      case 'tin':
        label = this.formatTin(value);
        break;
      case 'image':
        label = (
          <img
            style={{ opacity: value ? 1 : 0 }}
            width="50"
            height="50"
            src={value}
          />
        );
        break;
      default:
        label = value;
    }
    return label;
  };
  render() {
    let {
      data: { step1, step2, step3, creator, createTime, categoryName },
      fields
    } = this.props;
    if (!step1) return null;

    let step1RelationFields = [];
    let copyFields = _.cloneDeep(fields);
    copyFields.t_account_profiles
      .filter(el => el.relationFunc)
      .forEach(outerEl => {
        let item = outerEl.optionList.find(
          el => el.value === step1[outerEl.key]
        );
        let field = item && item.relationField;
        step1RelationFields.push(field);
      });
    copyFields.t_account_profiles = copyFields.t_account_profiles.filter(el => {
      if (el.relation && !step1RelationFields.includes(el.key)) {
        return false;
      } else {
        return true;
      }
    });
    return (
      <div className={cs['tpl-content']}>
        <div className={cs['head']}>
          <span>
            {i18n['task.export.tips.download.creator']}：{creator}
          </span>
          <span>
            {i18n['task.object_detail.create_time']}：
            {moment(createTime).format('YYYY-MM-DD HH:mm')}
          </span>
        </div>
        <div className={cs['body']}>
          <div className={cs['title']}>
            {
              i18n[
                'task.object_setting.task_setting.task_group_type.JOB_TYPE_TA_OPEN'
              ]
            }
          </div>
          <div className={cs['card']}>
            <div>{i18n['settings.conditions_setting.basic_info']}</div>
            <div className={cs['content']}>
              {copyFields.t_account_profiles.map(el => {
                return (
                  <div>
                    <span>{el.label}</span>
                    {this.renderLabel(el, step1[el.key])}
                  </div>
                );
              })}
            </div>
          </div>
          <div className={cs['card']}>
            <div>{i18n['account.edit_account.tabs.financial_info']}</div>
            <div className={cs['content']}>
              {copyFields.t_account_finacial.map(el => {
                return (
                  <div>
                    <span>{el.label}</span>
                    {this.renderLabel(el, step2[el.key])}
                  </div>
                );
              })}
            </div>
          </div>
          <div className={cs['card']}>
            <div>{i18n['account.edit_account.tabs.certificate_info']}</div>
            <div className={cs['content']}>
              {copyFields.t_account_id_info.map(el => {
                return (
                  <div>
                    <span>{el.label}</span>
                    {this.renderLabel(el, step3[el.key])}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default openAccountTemplate;
