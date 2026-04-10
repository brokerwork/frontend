import i18n from 'utils/i18n';
import SendMessageModal from 'components/sendMessageModal';
import { Icon, Dropdown, Menu, Button, Input, Breadcrumb } from 'lean-ui';
import { Summary } from 'components/v2/PageWraper';
import { CardPanelWrapper } from 'components/v2/CardPanel';
import CreateModal from '../../containers/CreateModal';
import cs from './index.less';
export default class ActionBar extends PureComponent {
  state = {
    showModal: false
  };
  toggleModal = show => {
    this.setState({
      showModal: show
    });
  };
  //输入搜索框回车触发搜索
  applySearchKey = e => {
    if (e.keyCode !== 13) return;
    const { params, getUsers } = this.props;
    getUsers(params);
  };
  applySearch = () => {
    const { params, getUsers } = this.props;
    getUsers(params);
  };
  modifyParams = (isGetUsers, key, value) => {
    const { params, modifyParams, getUsers } = this.props;
    let __obj = {};
    //时间范围改变
    if (key === 'date') {
      __obj = value;
    } else if (key === 'value') {
      __obj = {
        value: value.target.value
      };
    } else {
      __obj = {
        [key]: value
      };
    }
    Promise.resolve(
      modifyParams({
        ...params,
        ...__obj,
        page: 1
      })
    ).then(() => {
      if (!isGetUsers) return;
      const p = this.props.params;
      getUsers(p);
    });
  };
  render() {
    const { showModal } = this.state;
    const { paginationInfo, listUpdateTime, params, userRights } = this.props;
    const { sort, order } = params;
    const sortLabel =
      sort === 'registerTime'
        ? i18n['tausermgmt.table_header.registration_time']
        : i18n['tausermgmt.table_header.recent_login_time'];
    return (
      <div className={cs['actions-bar']}>
        <div className={cs['left-part']}>
          <div className={cs['primary-top-title']}>
            <Icon
              fontType="bw"
              icon="user-color"
              className={`${cs['customer-icon']}`}
            />
            <div className={cs['module-info']}>
              <Breadcrumb>
                <Breadcrumb.Item>{i18n['tausermgmt.title']}</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          <Summary.Info
            total={paginationInfo.total}
            orderBy={sortLabel}
            updateTime={listUpdateTime}
          />
        </div>
        <div className={cs['right-part']}>
          {/* jason让改的这个权限 */}
          {userRights['TAUSER_ENABLE'] ? (
            <div className={cs['button-area']}>
              <Button
                type="primary"
                onClick={this.toggleModal.bind(this, true)}
              >
                {i18n['tausermgmt.create_user']}
              </Button>
            </div>
          ) : null}
          <div className={cs['search-input']}>
            <Input
              addonAfter={
                <div
                  onClick={this.applySearch}
                  className={cs['input-search-addon']}
                >
                  <Icon icon="search" />
                </div>
              }
              placeholder={i18n['tausermgmt.search.placeholder']}
              value={params.value}
              onChange={this.modifyParams.bind(this, false, 'value')}
              onKeyUp={this.applySearchKey}
            />
          </div>
        </div>
        <CardPanelWrapper>
          {showModal && (
            <CreateModal
              onClose={this.toggleModal.bind(this, false)}
              onChange={this.onChange}
            />
          )}
        </CardPanelWrapper>
      </div>
    );
  }
}