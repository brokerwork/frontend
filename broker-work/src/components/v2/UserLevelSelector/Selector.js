import ColumnSelector, { ColumnPicker } from 'components/ColumnSelector';
import { Button, Icon, Dialog } from 'lean-ui';
import Radio from 'components/Radio';
import cs from './UserLevelSelector.less';
import i18n from 'utils/i18n';
import DropdownForCode from 'components/v2/DropdownForCode';

class TreeModal extends PureComponent {
  constructor(props) {
    super(props);
    const { initialData, defaultValue } = this.props;
    const columnData = initialData ? [initialData] : [];
    this.state = {
      userIds: [],
      columnData,
      subClumnData: null,
      parentValue: defaultValue,
      currentValue: defaultValue,
      isDirect: false,
      isSelf: !!this.props.multiple,
      handleData: [],
      searchUser: '',
      selectedItem: {}
    };
  }
  componentDidMount() {
    const { currentValue, columnData } = this.state;
    this.getData(currentValue, columnData);
  }
  getData = (selected = {}, data) => {
    const {
      getData,
      showDirect = true,
      multiple,
      hasAllUserRight,
      changeNodeState,
      reportType // 佣金报表 commissionReports 个人， 其他显示 直属
    } = this.props;
    getData(selected.value).then(res => {
      const __data = data.concat();
      let __subData = null;
      if (!res.result) return Promise.resolve(res);
      if (Array.isArray(res.data) && res.data.length > 0) {
        const __d = res.data.concat();
        if (__data.length >= 1 && showDirect) {
          if (multiple) {
            __d.push({
              child: false,
              label:
                reportType === 'commissionReports'
                  ? i18n['user_level_selector.personal']
                  : i18n['user_level_selector.direct'],
              value: selected.value,
              direct: true
            });
            __subData = __d;
          } else {
            __d.push({
              child: false,
              label:
                reportType === 'commissionReports'
                  ? i18n['user_level_selector.personal']
                  : i18n['user_level_selector.direct'],
              value: '-1'
            });
          }
        }
        if (__data.length === 0 && hasAllUserRight) {
          __d.unshift({
            child: false,
            label: i18n['user_level_selector.all_user'],
            value: 'all'
          });
        }
        if (multiple) {
          __data.push(res.data.concat());
        } else {
          __data.push(__d);
        }
      }
      const stateItem = [
        { label: 'userIds', value: this.getDefaultSubValues(__subData) },
        { label: 'columnData', value: __data },
        { label: 'subClumnData', value: __subData },
        { label: 'currentValue', value: selected },
        { label: 'parentValue', value: selected },
        { label: 'isDirect', value: false }
      ];
      changeNodeState(stateItem);
      this.setState({
        columnData: __data,
        subClumnData: __subData,
        parentValue: selected,
        currentValue: selected,
        isDirect: false,
        userIds: this.getDefaultSubValues(__subData)
      });
    });
  };
  onPick = (data, values) => {
    const { changeNodeState } = this.props;
    changeNodeState([{ label: 'userIds', value: values }]);
  };
  onSelect = (selected, data, selectedItem) => {
    const { multiple, changeNodeState } = this.props;
    this.setState({ selectedItem });
    if (selected.child) {
      return this.getData(selected, data);
    } else {
      // else if (multiple) {
      //   if (selected.direct) {
      //     return;
      //   }
      //   const __data = data.concat();
      //   const __subData = [{ child: false, label: i18n['user_level_selector.direct'], value: selected.value, direct: true  }];
      //   __data.push(__subData);
      //   this.setState({
      //     columnData: __data,
      //     subClumnData: __subData,
      //     parentValue: selected,
      //     currentValue: selected,
      //     isDirect: false,
      //     userIds: this.getDefaultSubValues(__subData)
      //   });
      //   return;
      // }
      const stateItem = [
        { label: 'userIds', value: [] },
        { label: 'columnData', value: data.concat() },
        { label: 'subClumnData', value: null },
        { label: 'currentValue', value: selected },
        { label: 'isDirect', value: selected.value == -1 }
      ];
      changeNodeState(stateItem);
      this.setState({
        userIds: [],
        columnData: data.concat(),
        subClumnData: null,
        currentValue: selected,
        isDirect: selected.value == -1
      });
    }
  };
  changeIsSelf = bool => {
    const { changeNodeState } = this.props;
    changeNodeState([{ label: 'isSelf', value: bool }]);
    this.setState({
      isSelf: bool
    });
  };
  getDefaultSubValues = subClumnData => {
    return subClumnData ? subClumnData.map(item => item.value) : [];
  };
  onFilter = v => {
    const { onFilter } = this.props;
    const copyData = [];
    if (v.length) {
      onFilter(v).then(res => {
        if (res.result && res.data.length) {
          res.data.map(item => {
            copyData.push({
              label: `${item.entityNo}:${item.label}`,
              value: item.value
            });
          });
        }
        this.setState({
          handleData: copyData
        });
      });
    } else {
      this.setState({
        handleData: copyData
      });
    }
  };
  initialDataStatusChange = (data, nodeInfo) => {
    const { selectedItem } = this.state;
    let copySelectedItem = Object.assign(selectedItem, {});
    const copyLength = Object.keys(copySelectedItem).length || 0;
    if (data && data.length > 0) {
      data.map(item => {
        if (item.selected) {
          nodeInfo.push(data);
          copySelectedItem = Object.assign(selectedItem, {
            [eval(copyLength)]: item.value
          });

          if (item.child) {
            this.initialDataStatusChange(item.children, nodeInfo);
          }
        }
      });
    }
    this.setState({
      selectedItem: copySelectedItem
    });
    return nodeInfo;
  };
  onSearch = (v, selectItem) => {
    const { getSearchTree, changeNodeState } = this.props;
    this.setState({ selectedItem: {} });
    getSearchTree(v).then(res => {
      if (res.result) {
        this.setState({
          searchUser: `${v}`,
          handleData: [selectItem]
        });
        let selected = {};
        let __data = [];
        let __subData = null;
        if (!res.result) return Promise.resolve(res);
        if (Array.isArray(res.data) && res.data.length > 0) {
          __data = this.initialDataStatusChange(res.data, []);
        }
        const stateItem = [
          { label: 'userIds', value: [] },
          { label: 'columnData', value: __data.concat() },
          { label: 'subClumnData', value: null },
          { label: 'currentValue', value: selectItem },
          { label: 'isDirect', value: selected.value == -1 }
        ];
        changeNodeState(stateItem);
        this.setState({
          columnData: __data,
          subClumnData: __subData,
          parentValue: selected,
          currentValue: selected,
          isDirect: false,
          userIds: this.getDefaultSubValues(__subData)
        });
      }
    });
  };
  render() {
    const {
      defaultValue,
      onHide,
      title,
      type = 'view',
      searchable
    } = this.props;
    const {
      multiple,
      columnData,
      isSelf,
      subClumnData,
      userIds,
      handleData,
      searchUser,
      selectedItem
    } = this.state;
    const defaultSubValues = this.getDefaultSubValues(subClumnData);
    const disabledSubmit =
      isSelf && !userIds.length && subClumnData && subClumnData.length;
    return (
      <div>
        <div
          className={`${cs['column-container']} ${isSelf &&
            !!subClumnData &&
            cs['column-group']}`}
        >
          {searchable ? (
            <DropdownForCode
              searchPlaceholder={i18n['user_level_selector.search_title']}
              className={cs['dropdown']}
              data={handleData}
              value={searchUser}
              onSelect={this.onSearch}
              onSearch={this.onFilter}
              searchable
            />
          ) : (
            undefined
          )}
          <div>
            {multiple && <div>{i18n['user_level_selector.target_title']}</div>}
            <ColumnSelector
              className={cs['selector']}
              onChange={this.onSelect}
              selectedItem={selectedItem}
              defaultValue={
                defaultValue ? { 0: defaultValue.value } : undefined
              }
              data={columnData}
            />
          </div>

          {isSelf &&
            !!subClumnData && (
              <div className={cs['sub-picker']}>
                {multiple && (
                  <div>{i18n['user_level_selector.range_title']}</div>
                )}
                <ColumnPicker
                  className={cs['selector']}
                  defaultValues={defaultSubValues}
                  onChange={this.onPick}
                  data={subClumnData}
                />
              </div>
            )}
        </div>
        {multiple === 'toggle' ? (
          <div className={cs['grid-control']}>
            <span>{i18n['user_level_selector.select_range']}</span>
            {[true, false].map(bool => {
              return (
                <span key={bool}>
                  <Radio
                    name="isSelf"
                    className={cs['radio']}
                    checked={isSelf === bool}
                    inline
                    onChange={this.changeIsSelf.bind(this, bool)}
                  >
                    {i18n[`user_level_selector.is_self_${bool}`]}
                  </Radio>
                </span>
              );
            })}
          </div>
        ) : (
          undefined
        )}
      </div>
    );
  }
}
export default class UserLevelSelector extends PureComponent {
  constructor(props) {
    super(props);
    const { initialData, defaultValue } = this.props;
    const columnData = initialData ? [initialData] : [];
    this.state = {
      userIds: [],
      columnData,
      subClumnData: null,
      parentValue: defaultValue,
      currentValue: defaultValue,
      isDirect: false,
      isSelf: !!this.props.multiple,
      showModal: false,
      modalFull: false
    };
  }
  componentDidMount() {
    if (this.props.show) {
      this.showSelector();
    }
  }
  onSubmit = () => {
    const { onSubmit } = this.props;
    const {
      currentValue,
      parentValue,
      isDirect,
      userIds,
      isSelf,
      subClumnData
    } = this.state;
    const result = isDirect ? parentValue : currentValue;
    let __data = userIds;
    if (!subClumnData) {
      __data = null;
    } else if (subClumnData && !subClumnData.length) {
      __data = null;
    } else if (subClumnData && subClumnData.length === userIds.length) {
      __data = null;
    }
    if (onSubmit) {
      onSubmit(result, isDirect, __data, isSelf);
    }
  };
  changeNodeState = selectItem => {
    selectItem.forEach(item => {
      this.setState({
        [item.label]: item.value
      });
    });
  };

  showSelector = () => {
    const { showTipsModal, title, closeView } = this.props;
    if (closeView) {
      closeView();
    }
    this.setState({
      showModal: true
    });
  };

  onConfirm = () => {
    const { columnData, isSelf, subClumnData, userIds } = this.state;
    const { defaultValue, onHide, title, type = 'view', multiple } = this.props;
    const disabledSubmit =
      isSelf && !userIds.length && subClumnData && subClumnData.length;
    if (type === 'view' || disabledSubmit) {
      this.onCloseModal();
      return;
    } else {
      this.onSubmit();
      this.onCloseModal();
    }
  };
  onCloseModal = () => {
    this.setState({
      showModal: false
    });
    this.props.onHide && this.props.onHide();
  };
  fullScreen = () => {
    this.setState({
      modalFull: !this.state.modalFull
    });
  };
  render() {
    const {
      children,
      className,
      getData,
      noButton,
      showTipsModal,
      title,
      closeView
    } = this.props;
    const { showModal, modalFull } = this.state;
    // if (noButton) return null;
    return (
      <span
        className={`${className} ${cs['btn']}`}
        onClick={this.showSelector.bind(this, true)}
      >
        {children ? (
          children
        ) : !noButton ? (
          <span>
            <i className={`fa fa-sitemap ${cs['external-menu-icon']}`} />{' '}
            {i18n['usermgmt.user_search_type.by_user_tree']}
          </span>
        ) : null}
        {showModal ? (
          <Dialog
            title={title ? title : i18n['user_level_selector.tree_modal_title']}
            width={modalFull ? window.innerWidth : 520}
            visible
            closable
            className={modalFull ? 'full' : ''}
            onCancel={this.onCloseModal}
            footer={
              <div>
                <Button onClick={this.fullScreen} style={{ float: 'left' }}>
                  {
                    i18n[
                      `user_level_selector.full_screen${
                        modalFull ? '_cancel' : ''
                      }`
                    ]
                  }
                </Button>
                <Button onClick={this.onCloseModal}>
                  {i18n['general.cancel']}
                </Button>
                <Button type="primary" onClick={this.onConfirm}>
                  {i18n['general.apply']}
                </Button>
              </div>
            }
          >
            <TreeModal {...this.props} changeNodeState={this.changeNodeState} />
          </Dialog>
        ) : null}
      </span>
    );
  }
}
