import DropdownForCode from 'components/v2/DropdownForCode';
import { Checkbox } from 'lean-ui';
import cs from './SendObject.less';
import { findDOMNode } from 'react-dom';
import { post } from 'utils/ajax';
import i18n from 'utils/i18n';

export default class SendObjects extends PureComponent {
  hideSearchResultList = e => {
    const tagBox = findDOMNode(this.refs['tag-box']);
    const { showSearchResultList } = this.state;
    if (!showSearchResultList || tagBox.contains(e.target)) return;
    const { warningCheck, data } = this.props;
    warningCheck(data);
    tagBox.querySelector('input').value = '';
    this.setState({
      showSearchResultList: false,
      searchResults: []
    });
  };
  componentDidMount() {
    document.addEventListener('click', this.hideSearchResultList);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.hideSearchResultList);
  }
  state = {
    searchResults: [],
    showSearchResultList: false
  };
  onInputBlur = () => {
    const tagBox = findDOMNode(this.refs['tag-box']);
    tagBox.classList.remove(cs['focus']);
  };
  onInputFocus = () => {
    this.refs['tag-box'].classList.add(cs['focus']);
    this.setState({
      showSearchResultList: true
    });
  };
  __InputChangePromiseId__ = 0;
  onInputChange = e => {
    const v = e.target.value;
    if (!v) {
      this.setState({
        searchResults: []
      });
      return;
    }
    const { toUserType, type, customerState } = this.props.data;
    const p = post({
      url: '/v1/message/msgReceiversQuery',
      data: {
        receiverType: toUserType,
        fuzzyVal: v,
        type: type,
        customerState
      }
    }).then(res => {
      if (!res.result) return;
      if (p.id === this.__InputChangePromiseId__) {
        const d = res.data.map(item => {
          return {
            label: item.name,
            value: item.id,
            type: item.idType,
            isGroup: item.idType === 'RoleId'
          };
        });
        this.setState({
          searchResults: d
        });
      }
    });

    p.id = ++this.__InputChangePromiseId__;
  };
  // 清空所有已经选择项
  onClearAll = obj => {
    const { onChange, data } = this.props;
    const __obj = obj.target ? {} : obj; //一次性简单屏蔽调用时把event传入的情况。
    onChange({
      ...data,
      toAll: false,
      toName: [],
      toUserId: [],
      toRoleId: [],
      toRoleName: [],
      ...__obj
    });
  };
  onAddChange = (field, item) => {
    const { onChange, data } = this.props;
    const { toName, toUserId, toRoleId, toRoleName } = data;
    const obj = { ...data };
    if (!onChange) return;
    if (field === 'toAll') {
      obj.toAll = true;
    } else if (field === 'toName') {
      obj['toName'] = toName.concat();
      obj['toUserId'] = toUserId.concat();
      obj['toName'].push(item.label);
      obj['toUserId'].push(item.value);
    } else if (field === 'toRoleName') {
      obj['toRoleName'] = toRoleName.concat();
      obj['toRoleId'] = toRoleId.concat();
      obj['toRoleName'].push(item.label);
      obj['toRoleId'].push(item.value);
    }
    onChange(obj);
  };
  onRemvoeChange = (field, index) => {
    const { onChange, data } = this.props;
    const { toName, toUserId, toRoleId, toRoleName } = data;
    const obj = { ...data };
    if (!onChange) return;
    if (field === 'toAll') {
      obj.toAll = false;
    } else if (field === 'toName') {
      obj['toName'] = toName.concat();
      obj['toUserId'] = toUserId.concat();
      obj['toName'].splice(index, 1);
      obj['toUserId'].splice(index, 1);
    } else if (field === 'toRoleName') {
      obj['toRoleName'] = toRoleName.concat();
      obj['toRoleId'] = toRoleId.concat();
      obj['toRoleName'].splice(index, 1);
      obj['toRoleId'].splice(index, 1);
    }
    onChange(obj);
  };
  onSearchItemSelect = (item, e) => {
    let field = item.isGroup ? 'toRoleName' : 'toName';
    if (item === 'toAll') {
      field = 'toAll';
    }
    if (e.target.checked) {
      this.onAddChange(field, item);
    } else {
      const { data } = this.props;
      if (field === 'toAll') {
        this.onRemvoeChange(field);
        return;
      }
      const index = data[field].indexOf(item.label);
      if (index === -1) return;
      this.onRemvoeChange(field, index);
    }
  };
  onTypeChange = v => {
    this.onClearAll({ toUserType: v });
  };
  onStateChange = value => {
    this.onClearAll({ customerState: value });
  };
  render() {
    const {
      toUserType,
      toAll,
      toName = [],
      toRoleName = [],
      toUserId = [],
      toRoleId = [],
      customerState
    } = this.props.data;
    const { options } = this.props;
    const { searchResults, showSearchResultList } = this.state;
    const selectedItems = [...toUserId, ...toRoleId];
    const selectedItemsObj = {};
    selectedItems.forEach(item => {
      selectedItemsObj[item] = true;
    });
    let placeholder = i18n['message.recvier.placeholder1'];
    if (toUserType === 'BwUser') {
      placeholder = i18n['message.recvier.placeholder2'];
    }
    const customerStates = [
      {
        value: 'Clue',
        label: i18n['customer.state_type.clue']
      },
      {
        value: 'Potential',
        label: i18n['customer.state_type.potential']
      },
      {
        value: 'Open',
        label: i18n['customer.state_type.open']
      },
      {
        value: 'Deposit',
        label: i18n['customer.state_type.deposit']
      },
      {
        value: 'Deal',
        label: i18n['customer.state_type.deal']
      }
    ];
    return (
      <div className={cs['container']}>
        <div>
          <DropdownForCode
            data={options}
            buttonClassName={cs['dropdown-btn']}
            value={toUserType}
            onChange={this.onTypeChange}
          />
        </div>
        <div>
          {toUserType === 'MyBwCustomer' && (
            <DropdownForCode
              data={customerStates}
              buttonClassName={cs['dropdown-btn']}
              value={customerState}
              onChange={this.onStateChange}
            />
          )}
        </div>
        <div className={cs['tag-box']} ref="tag-box" tabIndex="-1">
          {toAll ? (
            <div className={cs['tag']}>
              {i18n['message.all_user']}
              <i
                onClick={this.onRemvoeChange.bind(this, 'toAll')}
                className={`fa fa-times ${cs['tag-icon']}`}
              />
            </div>
          ) : (
            undefined
          )}

          {/* 已选择的角色 */}
          {toRoleName.length > 0
            ? toRoleName.map((item, index) => (
                <div className={cs['tag']} key={index}>
                  {item}
                  <i
                    onClick={this.onRemvoeChange.bind(
                      this,
                      'toRoleName',
                      index
                    )}
                    className={`fa fa-times ${cs['tag-icon']}`}
                  />
                </div>
              ))
            : undefined}

          {/* 已选择的用户 */}
          {toName.length > 0
            ? toName.map((item, index) => (
                <div className={cs['tag']} key={index}>
                  {item}
                  <i
                    onClick={this.onRemvoeChange.bind(this, 'toName', index)}
                    className={`fa fa-times ${cs['tag-icon']}`}
                  />
                </div>
              ))
            : undefined}
          <input
            type="text"
            className={cs['input']}
            onBlur={this.onInputBlur}
            placeholder={placeholder}
            onFocus={this.onInputFocus}
            onChange={this.onInputChange}
          />
          <i
            className={`fa fa-times ${cs['clear-all']}`}
            onClick={this.onClearAll}
          />
          {showSearchResultList ? (
            <ul className={cs['search-results']}>
              <li className={cs['search-results-item']}>
                <Checkbox
                  onChange={this.onSearchItemSelect.bind(this, 'toAll')}
                  checked={toAll}
                >
                  {i18n['message.all_user']}
                </Checkbox>
              </li>
              {searchResults.map((item, index) => {
                const checked = !!selectedItemsObj[item.value];
                return (
                  <li key={index} className={cs['search-results-item']}>
                    <Checkbox
                      onChange={this.onSearchItemSelect.bind(this, item)}
                      checked={checked}
                    >
                      <span
                        className={`${
                          item.isGroup ? cs['search-results-item__group'] : ''
                        }`}
                      >
                        {item.isGroup
                          ? `${item.label}(${
                              i18n['usermgmt.search_type.role']
                            })`
                          : item.label}
                      </span>
                    </Checkbox>
                  </li>
                );
              })}
            </ul>
          ) : (
            undefined
          )}
        </div>
      </div>
    );
  }
}
