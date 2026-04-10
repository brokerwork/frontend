import i18n from 'utils/i18n';
import cs from '../AdvancedSearch.less';
import { Dropdown, Menu, Icon, Button, Message, Select } from 'lean-ui';
import PropTypes from 'prop-types';
import UserLevelSelector from 'components/v2/UserLevelSelector';
import UserSimpleSelector from '../UserSimpleSelector';
import _ from 'lodash';
let timer = null;
let cache = {};
const SPLIT_KEY = '##@#@@@';
const SPLIT_SUBBELONG = 'subBelong@#$';
const SPLIT_SUB = 'sub@#$';

export default class ViewList extends Component {
  firstSet = false;
  state = {
    conditionList: [],
    selectedKeys: [],
    data: [],
    currentView: undefined,
    testSearch: '',
    isModalVisible: false // 控制显示,
  };
  componentDidMount() {
    const { registFunction } = this.context;
    const { selectedKeys } = this.state;
    registFunction({
      conditionGetList: this.getList,
      conditionOnSelectView: this.onSelectViewItem,
      conditionRemove: this.onRemoveCondition
    });
    this.getList().then(res => {
      const { viewId } = this.context;
      if (viewId) {
        this.onSelectViewItem(viewId, true);
      }
    });
  }
  componentWillReceiveProps(nextProps, nextContent) {
    const { currentView, selectedKeys } = this.state;
    const {
      viewId: nextViewId,
      data: nextData,
      types: nextTypes
    } = nextContent;
    const { searchType: nextSearchType } = nextProps;
    const { searchType } = this.props;
    if (nextSearchType !== searchType) {
      this.getList(nextSearchType).then(() => {
        const { viewId } = this.context;
        const { conditionList } = this.state;
        if (Array.isArray(conditionList) && viewId) {
          const index = conditionList.findIndex(
            cond => cond.searchId === viewId
          );
          if (index < 0) {
            this.onSelectMenuItem({
              key: this.defaultKey
            });
          } else {
            this.onSelectViewItem(viewId, true);
          }
        }
      });
    }
    if (nextViewId && (currentView && currentView.searchId) !== nextViewId) {
      this.onSelectViewItem(nextViewId, true);
    } else {
      if (currentView && currentView.searchId) return;
      const nextFilterType = nextData.find(d =>
        ['categoryId', 'filterType', 'objectType'].includes(d.field)
      );

      if (
        nextFilterType &&
        nextFilterType.field === 'objectType' &&
        !Array.isArray(nextFilterType.value)
      ) {
        const nextKey = this.generatMenuKey(
          'field',
          nextFilterType.value,
          'objectType'
        );
        if (nextKey !== selectedKeys[0]) {
          this.onSelectMenuItem({
            key: nextKey
          });
        }
      }
      if (
        nextFilterType &&
        nextFilterType.value &&
        nextFilterType.value.value
      ) {
        const nextKey = this.generatMenuKey(
          'field',
          nextFilterType.value.value,
          nextFilterType.field
        );
        if (nextKey !== selectedKeys[0]) {
          this.onSelectMenuItem({
            key: nextKey
          });
        }
      }
    }
  }
  getList = nextSearchType => {
    const { searchType } = this.props;
    const { getConditions } = this.context;
    if (!searchType) return Promise.resolve();
    let reqSearchType = searchType;
    if (nextSearchType) {
      reqSearchType = nextSearchType;
    }
    return getConditions({ searchType: reqSearchType }).then(res => {
      if (res.result) {
        const conditionList = parseConditionsListData(res.data);
        cache[searchType] = conditionList;
        this.setState(
          {
            conditionList
          },
          () => {
            return Promise.resolve();
          }
        );
      }
      return Promise.resolve();
    });
  };
  quickRemoveCondition = value => {
    const { removeCondition, showTipsModal, showTopAlert } = this.context;
    const { searchType } = this.props;
    removeCondition(value, searchType).then(res => {
      if (res.result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.remove_success']
        });
        this.getList().then(() => {
          const { conditionList, currentView } = this.state;
          if (currentView && currentView.searchId === value) {
            const mainFilter = this.getMainFilter();
            const { optionList: mainOptionList = [] } = mainFilter || {};
            this.onSelectItem(
              mainOptionList[0] && mainOptionList[0].value,
              'field',
              mainFilter.value
            );
          }
        });
      }
    });
  };

  onRemoveCondition = (value, e) => {
    const { removeCondition, showTipsModal, showTopAlert } = this.context;
    const { searchType } = this.props;
    return new Promise(resolve => {
      showTipsModal({
        content: i18n['advanced_search.form.confirm_remove'],
        onConfirm: cb => {
          removeCondition(value, searchType).then(res => {
            if (res.result) {
              showTopAlert({
                bsStyle: 'success',
                content: i18n['general.remove_success']
              });
              resolve();
              this.getList().then(() => {
                const { conditionList, currentView } = this.state;
                if (currentView && currentView.searchId === value) {
                  const mainFilter = this.getMainFilter();
                  const { optionList: mainOptionList = [] } = mainFilter || {};
                  this.onSelectItem(
                    mainOptionList[0] && mainOptionList[0].value,
                    'field',
                    mainFilter.value
                  );
                }
              });
              cb();
            }
          });
        }
      });
    });

    e.preventDefault();
    e.stopPropagation();
  };

  getMainFilterList = () => {
    const { types } = this.context;
    return types.filter(item => item.mainFilter);
  };
  getMainFilter = (key, fallbackFirstSelect = true) => {
    const { types } = this.context;
    return (
      types.find(item => item.mainFilter && item.value === key) ||
      types.find(item => item.mainFilter && item.optionList)
    );
  };
  getAddToTopFilter = (name, key) => {
    const { types } = this.context;
    return types.find(item => {
      return key ? item[name] && item.value === key : item[name];
    });
  };
  onSelectViewItem = (value, noTigger) => {
    //选择视图
    this.onSelectItem(value, 'view', '', noTigger);
  };
  addTotopOriginalValue = null; //
  onSelectMenuItem = mixKey => {
    const { subBelong, sub, right } = this.props;
    if (mixKey.key) {
      const [type, value, fieldKey] = mixKey.key.split(SPLIT_KEY);
      //选择菜单转参数
      this.onSelectItem(value, type, fieldKey);
    } else {
      const addTotop = this.getAddToTopFilter('addToTop');
      this.addTotopOriginalValue = mixKey;
      const value = right
        ? right === 'subBelong'
          ? `${SPLIT_SUBBELONG}${mixKey.value}`
          : `${SPLIT_SUB}${mixKey.value}`
        : subBelong
          ? `${SPLIT_SUBBELONG}${mixKey.value}`
          : sub
            ? `${SPLIT_SUB}${mixKey.value}`
            : mixKey.value;
      this.onSelectItem(value, 'simpleSearchField', addTotop.value);
    }

    this.showVisible('isModalVisible', false);
  };

  onSelectItem = (value, type, fieldKey, noTigger) => {
    const {
      mergeConditions,
      editCondition,
      getViewDetail,
      types,
      convertToCommonFormat,
      updateViewData,
      onConditionChange,
      showTopAlert
    } = this.context;
    const { conditionList, currentView, selectedKeys } = this.state;
    const selectedFilter = this.getMainFilter(fieldKey);
    let newCurrentView = undefined;
    const keyPath = [this.generatMenuKey(type, value, fieldKey)];
    if (type !== 'new') {
      if (type === 'view') {
        newCurrentView = conditionList.find(item => item.searchId === value);
        this.setState(
          {
            selectedKeys: keyPath,
            currentView: newCurrentView
          },
          () => {
            this.getConditionDetail(value).then(
              res => {
                if (mergeConditions && updateViewData) {
                  updateViewData(res);
                  mergeConditions(
                    { value, type },
                    noTigger === true,
                    res.condition
                  );
                }
              },
              res => {
                if (res) {
                  this.setState({
                    currentView,
                    selectedKeys
                  });
                  const closeMessage = Message.error(
                    <span>
                      {i18n['advanced_search.field_forbidden']}
                      {res && res.isSystem ? (
                        undefined
                      ) : (
                        <span
                          className={cs['delete-link']}
                          onClick={() => {
                            closeMessage();
                            this.quickRemoveCondition(value);
                          }}
                        >
                          {i18n['advanced_search.immediately_delete']}
                        </span>
                      )}
                    </span>
                  );
                }
              }
            );
          }
        );
      } else if (type === 'field' || type === 'simpleSearchField') {
        if (
          !!selectedFilter &&
          selectedFilter.fieldType === 'userLevel' &&
          value === ''
        ) {
          return;
        }
        if (value !== undefined) {
          this.setState({
            selectedKeys: keyPath,
            currentView: newCurrentView
          });
          this.addMainfilterData(type, value, fieldKey, noTigger);
        }
      }
    } else {
      if (editCondition) {
        editCondition('add');
      }
    }
  };
  generatMenuKey = (type, value = '', fieldKey) => {
    return [type, value, fieldKey].join(SPLIT_KEY);
  };
  getConditionDetail = viewId => {
    const {
      getViewDetail,
      types,
      convertToCommonFormat,
      searchType
    } = this.context;
    if (getViewDetail) {
      return getViewDetail(viewId, searchType).then(res => {
        let newData = [];
        let isSystem = true;
        let newName = '';
        if (res && res.data) {
          const { condition = [], searchLevel, name } = res.data;
          isSystem = searchLevel !== 'USER';
          newData = convertToCommonFormat(condition);
          newName = name;
        }
        const invalidField = newData.find(
          item => !types.some(type => type.value === item.field)
        );
        const result = {
          ...res.data,
          data: newData,
          isSystem
        };

        if (invalidField) {
          return Promise.reject(result);
        }

        return result;
      });
    } else {
      return Promise.reject();
    }
  };

  onEditView = () => {
    const { editCondition } = this.context;
    if (editCondition) {
      editCondition('edit');
    }
  };
  getMainfieldMenu = () => {
    const { reportType, right, currentReport } = this.props;
    const mainFilters = this.getMainFilterList();
    return mainFilters
      .map((filter, i) => {
        const { optionList: mainOptionList = [] } = filter;
        switch (filter.fieldType) {
          case 'select':
            return mainOptionList.map(item => (
              <Menu.Item
                key={this.generatMenuKey('field', item.value, filter.value)}
              >
                {filter.renderItem ? filter.renderItem(item) : item.label}
              </Menu.Item>
            ));
            break;
          case 'userLevel':
            return mainOptionList
              .map(item => (
                <Menu.Item
                  key={this.generatMenuKey('field', item.value, filter.value)}
                >
                  {item.label}
                </Menu.Item>
              ))
              .concat(
                <Menu.Item
                  key={this.generatMenuKey('field', undefined, filter.value)}
                >
                  <UserLevelSelector
                    className={cs['user-selector']}
                    {...filter.additions}
                    type="searchType"
                    reportType={reportType}
                    closeView={this.showVisible.bind(
                      this,
                      'isModalVisible',
                      false
                    )}
                    onSubmit={(data, isDirect) => {
                      // let selectItem = [
                      //   right
                      //     ? {
                      //         label:
                      //           i18n[
                      //             `user_level_selector.${
                      //               right === 'sub' ? 'no_direct' : 'direct'
                      //             }}`
                      //           ],
                      //         value: right
                      //       }
                      //     : isDirect
                      //       ? {
                      //           label: i18n['user_level_selector.direct'],
                      //           value: 'sub'
                      //         }
                      //       : {
                      //           label: i18n['user_level_selector.no_direct'],
                      //           value: 'subBelong'
                      //         },
                      //   data
                      // ];
                      const selectItem = [
                        isDirect
                          ? {
                              label: i18n['user_level_selector.direct'],
                              value: 'sub'
                            }
                          : right
                            ? {
                                label:
                                  i18n[
                                    `user_level_selector.${
                                      right === 'sub' ? 'no_direct' : 'direct'
                                    }}`
                                  ],
                                value: right
                              }
                            : {
                                label: i18n['user_level_selector.no_direct'],
                                value: 'subBelong'
                              },
                        data
                      ];

                      this.onSelectItem(selectItem, 'field', filter.value);
                    }}
                  />
                </Menu.Item>
              );
            break;
          default:
            return undefined;
        }
      })
      .filter(item => item);
  };
  addMainfilterData = (type, value, fieldKey, noTigger, firstSet) => {
    const { mergeConditions, updateViewData } = this.context;
    const selectedFilter = this.getMainFilter(fieldKey);
    const addToTop = this.getAddToTopFilter('addToTop', fieldKey);
    if (!!selectedFilter && selectedFilter.optionList) {
      if (mergeConditions) {
        updateViewData();
        const { optionList: mainOptionList = [] } = selectedFilter || {};
        let originValue;
        if (selectedFilter.fieldType === 'select') {
          originValue = mainOptionList.find(item => item.value === value);
        } else if (selectedFilter.fieldType === 'userLevel') {
          if (!Array.isArray(value)) {
            originValue = [].concat(
              mainOptionList.find(item => item.value === value)
            );
          } else {
            originValue = _.cloneDeep(value);
          }
        }
        mergeConditions(
          {
            value,
            type,
            fieldKey,
            originValue,
            isFirstset: firstSet // 因为此处会多次调用此方法，该参数用于判断是否是组件刚加载时调用，
          },
          noTigger === true
        );
      }
    }
    if (type === 'simpleSearchField' && addToTop && mergeConditions) {
      updateViewData();
      mergeConditions(
        {
          value,
          type,
          fieldKey,
          originValue: this.addTotopOriginalValue
        },
        noTigger === true
      );
    }
  };
  getMenu = () => {
    const { conditionList, selectedKeys, currentView, testSearch } = this.state;
    const { searchType, data } = this.context;
    const { showSearch, getData, dataType } = this.props;
    const mainFilter = this.getMainFilter();
    const { optionList: mainOptionList = [] } = mainFilter || {};
    const userTreeSelect = data.find(item =>
      ['userSearchType', 'objectType'].includes(item.field)
    );
    const defaultKey =
      userTreeSelect &&
      userTreeSelect.originValue &&
      userTreeSelect.originValue.length > 1
        ? this.generatMenuKey('field', undefined, mainFilter.value)
        : dataType === 'AccountReport'
          ? mainOptionList &&
            mainOptionList.find(el => el.value === 'all') &&
            mainOptionList.find(el => el.value === 'all').value &&
            this.generatMenuKey(
              'field',
              mainOptionList.find(el => el.value === 'all').value,
              mainFilter.value
            )
          : mainOptionList &&
            mainOptionList[0] &&
            mainOptionList[0].value &&
            this.generatMenuKey(
              'field',
              mainOptionList[0].value,
              mainFilter.value
            );
    let hackSelectedKeys = [];
    if (selectedKeys.length) {
      const [type, value, fieldKey] = selectedKeys[0].split(SPLIT_KEY);
      if (type === 'simpleSearchField') {
        hackSelectedKeys = selectedKeys;
      } else {
        hackSelectedKeys =
          userTreeSelect &&
          Array.isArray(userTreeSelect.value) &&
          userTreeSelect.value.length > 1
            ? [defaultKey]
            : selectedKeys;
      }
    } else {
      hackSelectedKeys = [defaultKey];
      // 将默认选项放到高级搜索数据里面去，等于选中初始数据
      if (this.firstSet === false && defaultKey !== undefined) {
        setTimeout(() => {
          const [type, value, fieldKey] = defaultKey.split(SPLIT_KEY);
          // 修复选择条件后，跳转到其他页面在返回，value为空的问题
          if (!value) {
            this.firstSet = false;
          }
          this.defaultKey = defaultKey;
          this.addMainfilterData(type, value, fieldKey, false, this.firstSet);
        });
        this.firstSet = true;
      }
    }
    return (
      <Menu
        selectedKeys={hackSelectedKeys}
        onSelect={this.onSelectMenuItem}
        className={cs['main-filter-menu']}
        selectable
      >
        {showSearch && (
          <UserSimpleSelector
            placeholder={i18n['general.search.search_user']}
            getData={getData}
            dataType={dataType}
            className={cs.userSimpleSelector}
          />
        )}
        {searchType ? (
          <Menu.ItemGroup
            title={i18n['advanced_search.conditions_type.system']}
          >
            {this.getMainfieldMenu()}
          </Menu.ItemGroup>
        ) : (
          this.getMainfieldMenu()
        )}
        {conditionList && conditionList.length ? (
          <Menu.ItemGroup
            title={i18n['advanced_search.conditions_type.custom']}
          >
            {conditionList.map(item => (
              <Menu.Item key={this.generatMenuKey('view', item.value)}>
                {item.label}
              </Menu.Item>
            ))}
          </Menu.ItemGroup>
        ) : (
          undefined
        )}
        {searchType
          ? [
              <Menu.Divider key="divder" />,
              <Menu.Item key={'new'}>
                <Icon icon="add-outline" />{' '}
                {i18n['advanced_search.create_conditions']}
              </Menu.Item>
            ]
          : undefined}
      </Menu>
    );
  };
  getValue = () => {
    const { selectedKeys, conditionList, currentLabel } = this.state;
    const { data } = this.context;
    const mixKey = selectedKeys[0] || '';
    const [type, value, fieldKey] = mixKey.split(SPLIT_KEY);
    if (!selectedKeys.length || type === 'field') {
      const mainFilter = this.getMainFilter(fieldKey);
      if (mainFilter && mainFilter.fieldType === 'select') {
        const { optionList: mainOptionList = [] } = mainFilter;
        return (
          mainOptionList.find(item => item.value === value) ||
          mainOptionList.find(el => el.value === 'all') ||
          {}
        ).label;
      } else if (mainFilter && mainFilter.fieldType === 'userLevel') {
        const { optionList: mainOptionList = [] } = mainFilter;
        const matchedValue = data.find(item => item.field === mainFilter.value);
        if (matchedValue) {
          const copyContent = _.cloneDeep(
            matchedValue && matchedValue.originValue
          );
          let label = '';
          if (copyContent.length > 1) {
            label = copyContent
              .reverse()
              .map(item => {
                return (item && item.label) || '';
              })
              .join('-');
          } else {
            console.log(1, mainFilter, copyContent);
            label =
              (copyContent[0] && copyContent[0].label) ||
              copyContent.label ||
              mainFilter.optionList[0].label;
          }
          return label;
        } else {
          return (
            mainOptionList.find(el => el.value === 'all') &&
            mainOptionList.find(el => el.value === 'all').label
          );
        }
      }
    } else if (type === 'simpleSearchField') {
      const addToTopFilter = this.getAddToTopFilter('addToTop', fieldKey);
      const matchedValue = data.find(
        item => item.field === addToTopFilter.value
      );
      if (matchedValue) {
        const copyContent = _.cloneDeep(
          matchedValue && matchedValue.originValue
        );
        return copyContent && copyContent.label;
      }
    } else {
      return (conditionList.find(item => item.value === value) || {}).label;
    }
  };
  showVisible = (modal, visible) => {
    this.setState({
      [modal]: visible
    });
  };
  visibleChange = val => {
    if (!val) {
      this.setState({
        isModalVisible: false
      });
    }
  };
  render() {
    const { value, className } = this.props;
    const { conditionList, currentView, isModalVisible } = this.state;
    const { types } = this.context;
    const labelValue = this.getValue();
    return (
      <div>
        <Dropdown
          overlay={this.getMenu()}
          trigger="click"
          className={cs['view-dropdown']}
          visible={isModalVisible}
          onVisibleChange={this.visibleChange}
        >
          <span
            className={`main-color ${cs['view-dropdown-label']}`}
            onClick={this.showVisible.bind(this, 'isModalVisible', true)}
          >
            <span>{labelValue}</span>{' '}
            <Icon icon="caret-bottom" className="main-color" />
          </span>
        </Dropdown>
        {currentView ? (
          <Button
            size="small"
            className={cs['view-edit-btn']}
            onClick={this.onEditView}
          >
            <Icon icon="edit-outline" /> <span>{i18n['general.edit']}</span>
          </Button>
        ) : (
          undefined
        )}
      </div>
    );
  }
}

//组合条件信息
function parseConditionsListData(conditionsList) {
  const copyData = conditionsList.concat();
  let conditionsData = [];
  copyData.forEach(condition => {
    conditionsData.push({
      ...condition,
      label: condition.name,
      value: condition.searchId
    });
  });
  return conditionsData;
}

ViewList.contextTypes = {
  openWithSearchId: PropTypes.func,
  registFunction: PropTypes.func,
  searchType: PropTypes.string,
  types: PropTypes.array,
  conditions: PropTypes.array,
  mergeConditions: PropTypes.func,
  getConditions: PropTypes.func,
  editCondition: PropTypes.func,
  getViewDetail: PropTypes.func,
  convertToCommonFormat: PropTypes.func,
  updateViewData: PropTypes.func,
  showTipsModal: PropTypes.func,
  showTopAlert: PropTypes.func,
  removeCondition: PropTypes.func,
  viewId: PropTypes.string,
  onConditionChange: PropTypes.func,
  data: PropTypes.array
};
