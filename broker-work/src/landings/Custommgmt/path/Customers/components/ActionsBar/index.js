import cs from './ActionsBar.less';
import i18n from 'utils/i18n';
import {
  Icon,
  Dropdown,
  Menu,
  Button,
  Input,
  Breadcrumb,
  Dialog,
  Upload
} from 'lean-ui';
import {
  CUSTOMER_TIME_SEARCH_TYPE,
  FUZZY_SEARCH_TYPES,
  DEFAULT_RANGES,
  REVISIT_RANGES,
  ADVANCED_SEARCH_CONFIG
} from '../../constant';
import { Summary } from 'components/v2/PageWraper';
import ConditionFilter from 'components/v2/ConditionFilter';
import { NavLink as Link } from 'react-router-dom';
import ImportModal from '../../containers/ImportModal';
import getQueryString from 'utils/queryString';

const sortFieldtoSortByMap = {
  revisitTime: 'RevisitTime',
  createTime: 'CreateTime',
  followTime: 'FollowTime'
};

const { Group: ButtonGroup } = Button;

export default class ActionsBar extends PureComponent {
  state = {
    mainFilter: this.props.searchTypes[0] || {},
    mainFilterVisible: false,
    importModalVisible: false
  };
  componentDidMount() {
    const { getCustomerLinkSource, getCustomerSource } = this.props;
    getCustomerSource();
    getCustomerLinkSource();
  }
  //新增客户
  createCustomer = () => {
    const {
      match: { path },
      history: { push }
    } = this.props;
    push(`${path}/create`);
  };

  onFuzzySearchTextChange = evt => {
    const { updateFuzzySearchText } = this.props;
    updateFuzzySearchText(evt.target.value);
  };

  onFuzzySearchBoxEnter = e => {
    const {
      updatePagination,
      getCustomerList,
      paginationInfo: { pageSize }
    } = this.props;
    Promise.resolve(
      updatePagination({
        currentPage: 1,
        pageSize
      })
    ).then(() => {
      getCustomerList();
    });
  };

  /**
   * 新建客户处的下拉框选择
   * @param key
   */
  onCreateDropMenuItemSelect = ({ key }) => {
    if (key === 'import') {
      this.toggleImportModal(true);
    }
  };

  toggleImportModal = visible => {
    this.setState({ importModalVisible: visible });
  };

  onCloseImportModal = (success = false) => {
    if (success) {
      const { getCustomerList } = this.props;
      getCustomerList();
    }
    this.toggleImportModal(false);
  };

  renderNewButton = () => {
    const { userRights } = this.props;
    if (userRights['CUSTOMER_ADD'] && !userRights['CUSTOMER_ADD_IMPORT']) {
      return (
        <Button onClick={this.createCustomer} type="primary">
          <Icon icon={'add-outline'} /> {i18n['customer.create_customer']}
        </Button>
      );
    }
    if (!userRights['CUSTOMER_ADD'] && !userRights['CUSTOMER_ADD_IMPORT']) {
      return null;
    }
    if (userRights['CUSTOMER_ADD_IMPORT']) {
      return (
        <ButtonGroup>
          <Button
            onClick={this.createCustomer}
            type="primary"
            className={cs['add-button']}
          >
            <Icon icon={'add-outline'} /> {i18n['customer.create_customer']}
          </Button>
          <Dropdown
            overlay={
              <Menu
                triggerSubMenuAction="click"
                selectable={false}
                onClick={this.onCreateDropMenuItemSelect}
              >
                <Menu.Item key="import">
                  {i18n['customer.create_customer.import']}
                </Menu.Item>
              </Menu>
            }
            trigger="click"
          >
            <Button
              type="primary"
              icon="caret-bottom"
              className={cs['add-import']}
            />
          </Dropdown>
        </ButtonGroup>
      );
    }
  };

  render() {
    const {
      searchTypes,
      listUpdateTime,
      currentSortParam,
      paginationInfo,
      customerColumns,
      userRights,
      fuzzySearchText
    } = this.props;
    const { mainFilter, mainFilterVisible } = this.state;
    const sortLabel = (
      customerColumns.find(
        item => sortFieldtoSortByMap[item.key] === currentSortParam.sortBy
      ) || {}
    ).label;
    return (
      <div className={cs['actions-bar']}>
        <div className={cs['left-part']}>
          <div className={cs['primary-top-title']}>
            <Icon
              fontType="bw"
              icon="customer-color"
              className={`main-color ${cs['customer-icon']}`}
            />
            <div className={cs['module-info']}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  {i18n['navigation.customer.module_name']}
                </Breadcrumb.Item>
              </Breadcrumb>
              <ConditionFilter.ViewList
                searchType={ADVANCED_SEARCH_CONFIG.searchType}
              />
            </div>
          </div>
          <Summary.Info
            total={`${paginationInfo.total}`}
            orderBy={sortLabel}
            updateTime={listUpdateTime}
          />
        </div>
        <div className={cs['right-part']}>
          <div className={cs['button-area']}>
            {this.renderNewButton()}{' '}
            <Dropdown
              overlay={
                <Menu triggerSubMenuAction="click" selectable={false}>
                  {userRights['CUSTOMER_RECYCLEBIN'] ? (
                    <Menu.Item key="trash">
                      <Link
                        className={cs['tool-link']}
                        to={`${this.props.match.url}/trash`}
                      >
                        {i18n['message.recycle_bin']}
                      </Link>
                    </Menu.Item>
                  ) : (
                    undefined
                  )}
                  <Menu.Item key="duplicate">
                    <Link
                      to={`${this.props.match.url}/duplicate`}
                      className={cs['tool-link']}
                    >
                      {i18n['customer.duplicate.title']}
                    </Link>
                  </Menu.Item>
                </Menu>
              }
              trigger="click"
            >
              <Button className={cs['more-menu']} icon="more" />
            </Dropdown>
          </div>
          <div className={cs['search-input']}>
            <Input
              suffix={<Icon icon="search" />}
              value={fuzzySearchText}
              onChange={this.onFuzzySearchTextChange}
              onPressEnter={this.onFuzzySearchBoxEnter}
              placeholder={i18n['customer.fuzzy_search.placeholder']}
            />
          </div>
        </div>
        <ImportModal
          visible={this.state.importModalVisible}
          onClose={this.onCloseImportModal}
        />
      </div>
    );
  }
}
