import cs from './index.less';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import i18n from 'utils/i18n';

const FORM_KEY_MAP = {
  t_account_profiles: 'form_basic',
  t_customer_profiles: 'form_basic',
  t_account_finacial: 'form_financial',
  t_account_id_info: 'form_id'
};

const FORM_NAME_IDS = ['form_basic', 'form_financial', 'form_id'];
export default class SearchList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchMode: false,
      searchData: [],
      fieldData: this.handleFieldsData(),
      selectedKeys: new Set()
    };
  }

  handleFieldsData = () => {
    const { listData = [] } = this.props;
    const data = listData.reduce((target, current) => {
      const { formName } = current;
      const key = FORM_KEY_MAP[formName];
      if (!target[key]) {
        target[key] = [];
      }
      target[key].push({ ...current });
      return target;
    }, {});
    return data;
  };

  onChangeKey = ({ target: { value = '' } }) => {
    // const { listData = [] } = this.props;
    const { fieldData } = this.state;
    if (value.length) {
      //filter items
      const searchData = {};
      Object.keys(fieldData).forEach(formName => {
        let list = fieldData[formName];
        list = list.filter(item => item.label.indexOf(value) !== -1);
        if (list.length) {
          searchData[formName] = list;
        }
      });
      this.setState({
        searchMode: true,
        searchData
      });
    } else {
      this.setState({
        searchMode: false,
        searchData: {}
      });
    }
  };

  toggleSelect = item => {
    const { onChangeSelect } = this.props;
    const { selectedKeys } = this.state;
    const { uuid } = item;
    if (selectedKeys.has(uuid)) {
      selectedKeys.delete(uuid);
    } else {
      selectedKeys.add(uuid);
    }
    if (onChangeSelect) {
      onChangeSelect(selectedKeys);
    }
    this.setState({ selectedKeys: new Set(selectedKeys) });
  };

  renderListItem = item => {
    const { renderItem } = this.props;
    const { uuid, label } = item;
    const selected = this.state.selectedKeys.has(uuid);
    let content = label;
    if (renderItem && typeof renderItem === 'function') {
      content = renderItem(item, selected);
    }
    return (
      <li key={uuid}>
        <i
          onClick={this.toggleSelect.bind(this, item)}
          className={`fa ${selected ? 'fa-checkbox-checked' : 'fa-checkbox-unchecked2'}`}
        />
        {content}
      </li>
    );
  };

  renderData = fieldData => {
    return FORM_NAME_IDS.map((formName, index) => {
      const list = fieldData[formName] || [];
      return list.length ? (
        <div key={index}>
          <span className={cs.formName}>{i18n[`field.setting.formName.${formName}`]}</span>
          <ul>{list.map(this.renderListItem)}</ul>
        </div>
      ) : (
        undefined
      );
    });
  };

  render() {
    const { searchData = [], searchMode = false, fieldData } = this.state;
    const data = searchMode ? searchData : fieldData;
    return (
      <div className={`form ${cs.list}`}>
        <input
          className="form-control"
          type="text"
          onChange={this.onChangeKey}
          placeholder={i18n['field.setting.field.searchTips']}
        />
        <div className={cs.contentWrapper}>
          {Object.keys(data).length ? (
            this.renderData(data)
          ) : (
            <div className={cs.info}>
              {searchMode ? i18n['field.setting.field.searchNotFound'] : i18n['field.setting.field.noField']}
            </div>
          )}
        </div>
      </div>
    );
  }
}
