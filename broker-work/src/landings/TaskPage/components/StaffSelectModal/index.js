import React from 'react';
import { findDOMNode } from 'react-dom';
import { Dialog, Button, Checkbox, Input, Icon } from 'lean-ui';
import cs from './StaffSelectModal.less';
import { injectReducer } from 'utils/injectReducer';
import { connect } from 'react-redux';
import { actions, reducers } from './control';
import { PARTICIPANT_TYPE } from '../../contants';
import i18n from 'utils/i18n';
import _ from 'lodash';

injectReducer('taskStaffSelectModal', reducers);

// 方便展开收起子组件
class SubItem extends React.Component {
  state = {
    expand: true
  };
  toggleExpand = () => {
    this.setState({
      expand: !this.state.expand
    });
  };
  render() {
    const { item, renderOptions } = this.props;
    const { expand } = this.state;
    return (
      <li>
        <div className={cs.selectListSubItem} onClick={this.toggleExpand}>
          <Icon icon="caret-bottom" className={cs.expandIcon} />
          {item.label}
        </div>
        <ul style={{ display: expand ? 'block' : 'none' }}>
          {item.children.map(sItem => renderOptions(sItem))}
        </ul>
      </li>
    );
  }
}

class StaffSelectModal extends React.Component {
  // 弹窗关闭以后清除弹窗中的数据
  onClose = () => {
    const { reset } = this.props;
    reset(); // 重置reducer中的数据
    const searchInput = this.getSearchInputDom();
    if (searchInput) {
      searchInput.value = ''; // 清除输入框中的值
    }
  };
  onOpen = () => {
    const { defaultStaff, setStaff } = this.props;
    if (defaultStaff) {
      const d = _.cloneDeep(defaultStaff);
      const preSelectedStaff = new Map();
      d.forEach(item => {
        preSelectedStaff.set(item.userId, {
          ...item,
          label: item.name,
          value: item.userId
        });
      });
      setStaff({
        preSelectedStaff
      });
    }
    this.onSearch('');
  };
  //  监控弹窗打开并触发事件
  componentWillReceiveProps(nextProps) {
    if (this.props.visible === false && nextProps.visible === true) {
      this.onOpen();
    }
  }
  // 提交数据,成功后关闭弹窗
  onSubmit = () => {
    const { selectedStaffKeys, selectedStaff, submit, onCancel } = this.props;
    const data = [];
    selectedStaffKeys.forEach(item => {
      data.push(selectedStaff.get(item));
    });
    submit(data).then(res => {
      if (!res.result) return;
      onCancel();
    });
  };
  getSearchInputDom = () => {
    const searchInputBox = findDOMNode(this.refs['searchInput']);
    if (searchInputBox) {
      return searchInputBox.querySelector('.lean-input');
    }
    return null;
  };
  // 搜索
  onSearch = () => {
    const { getOptionsData, type, stepType, objectInfo } = this.props;
    // const key = e.target ? e.target.value : e;
    const searchInput = this.getSearchInputDom();
    const key = searchInput ? searchInput.value : '';
    getOptionsData(key, type, stepType, objectInfo.itemType);
  };
  // 添加人员
  addStaff = item => {
    this.setStaff('add', item);
  };
  // 删除人员
  removeStaff = item => {
    this.setStaff('delete', item);
  };
  setStaff = (type, item) => {
    const { setStaff, selectedStaff } = this.props;
    setStaff({
      type,
      item,
      preSelectedStaff: selectedStaff
    });
  };
  onSelect(item, status) {
    if (status) {
      this.removeStaff(item);
    } else {
      this.addStaff(item);
    }
  }
  // 提取Options选项渲染逻辑, 方便做多层级选项渲染
  renderOptions = item => {
    const { selectedStaffKeys, type } = this.props;
    if (Array.isArray(item.children) && item.children.length > 0) {
      return this.renderSubOptions(item);
    }
    const checked = selectedStaffKeys.has(item.value);
    if (type === PARTICIPANT_TYPE.USER) {
      return this.renderUserOptions(item, checked);
    } else if (type === PARTICIPANT_TYPE.ROLE) {
      return this.renderRoleOptions(item, checked);
    }
    return null;
  };

  renderUserOptions = (item, checked) => {
    return (
      <li key={item.value}>
        <Checkbox
          checked={checked}
          onClick={this.onSelect.bind(this, item, checked)}
          className={cs.item}
        >
          {this.renderUserOptionsContent(item)}
        </Checkbox>
      </li>
    );
  };

  renderUserOptionsContent = item => {
    return (
      <div className={cs.userItem}>
        <div className={cs.userInfo}>
          <div>{item.label}</div>
          <div className={cs.entityNo}>{item.entityNo}</div>
        </div>
        <div className={cs.roleName}>{item.roleName}</div>
      </div>
    );
  };

  renderRoleOptions = (item, checked) => {
    return (
      <li key={item.value}>
        <Checkbox
          checked={checked}
          onClick={this.onSelect.bind(this, item, checked)}
        >
          {item.label}
        </Checkbox>
      </li>
    );
  };

  renderSubOptions(item) {
    return <SubItem item={item} renderOptions={this.renderOptions} />;
  }

  renderSelectedOptions = () => {
    const { selectedStaffKeys, selectedStaff, type } = this.props;
    const selectKeysArray = Array.from(selectedStaffKeys);
    return selectKeysArray.map(k => {
      const item = selectedStaff.get(k);
      return (
        <div key={item.value} className={cs.selectedItem}>
          {type === PARTICIPANT_TYPE.ROLE && (
            <span className={cs.selectedLabel}>{item.label}</span>
          )}
          {type === PARTICIPANT_TYPE.USER &&
            this.renderUserOptionsContent(item)}
          <Icon
            icon="close"
            className={cs.selectedRemoveIcon}
            onClick={this.removeStaff.bind(this, item)}
          />
        </div>
      );
    });
  };
  render() {
    const { options, visible, onCancel, type } = this.props;
    const title =
      type === PARTICIPANT_TYPE.USER
        ? i18n['task.object_setting.step.select.user']
        : i18n['task.object_setting.step.select.role'];
    const placeholder =
      type === PARTICIPANT_TYPE.USER
        ? i18n['task.object_setting.step.select.user.placeholder']
        : i18n['task.object_setting.step.select.role.placeholder'];
    return (
      <Dialog
        visible={visible}
        title={title}
        width="700"
        afterClose={this.onClose}
        okText={i18n['general.apply']}
        onCancel={onCancel}
        onOk={this.onSubmit}
        cancelText={i18n['general.cancel']}
      >
        <div className={cs.container}>
          <div className={cs.selectAreaBox}>
            <div>{i18n['task.object_setting.step.select']}：</div>
            <div className={cs.selectArea}>
              <div className={cs.searchBox}>
                <Input
                  ref="searchInput"
                  className={cs.searchBox}
                  onPressEnter={this.onSearch}
                  placeholder={placeholder}
                  addonAfter={
                    <Icon
                      className={cs.searchIcon}
                      icon="search"
                      onClick={this.onSearch}
                    />
                  }
                />
              </div>
              <ul className={cs.selectList}>
                {options.map(item => this.renderOptions(item))}
              </ul>
            </div>
          </div>
          <div className={cs.selectedAreaBox}>
            <div>{i18n['task.object_setting.step.selected']}：</div>
            <div className={cs.selectedArea}>
              {this.renderSelectedOptions()}
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default connect(
  ({ taskStaffSelectModal }) => {
    const keys = Object.keys(reducers);
    const props = {};
    keys.forEach(k => {
      props[k] = taskStaffSelectModal[k];
    });
    return props;
  },
  actions
)(StaffSelectModal);
