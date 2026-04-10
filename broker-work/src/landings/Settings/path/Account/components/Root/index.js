import { Button, Card, Table, Icon, Message } from 'lean-ui';
import NoDataView from 'components/v2/NoDataView';

import UpdateAccountModal from '../UpdateAccountModal';

import i18n from 'utils/i18n';
import cs from './AccountGroupSetting.less';
import SettingActionBar from 'landings/Settings/components/SettingActionBar';

const TTd = Table.Td;

export default class AccountGroupSetting extends PureComponent {
  state = {
    showUpdateAccountGroupModal: false,
    modalType: 'add'
  };

  columns = [
    { key: 'id', name: i18n['settings.account_group_setting.group_id'] },
    {
      key: 'groupName',
      name: i18n['settings.account_group_setting.group_name']
    },
    { key: 'op', name: i18n['settings.account_group_setting.action'] }
  ];

  componentWillMount() {
    const { getAccountGroupList } = this.props;
    getAccountGroupList();
  }

  toggleModal = (type, toggle, selected) => {
    const { updateCurrentGroup } = this.props;
    if (selected) {
      updateCurrentGroup(selected);
    }
    this.setState({
      [`show${type}Modal`]: toggle,
      modalType: selected ? 'edit' : 'add'
    });
  };

  showConfirmModal = selected => {
    const {
      showTipsModal,
      showTopAlert,
      deleteAccountGroup,
      checkAccountGroup,
      getAccountGroupList
    } = this.props;
    Promise.resolve(checkAccountGroup(selected.id)).then(res => {
      if (res.result && res.data) {
        showTipsModal({
          content: i18n['settings.account_group_setting.check_delete'],
          onConfirm: cb => {
            cb();
            deleteAccountGroup(selected.id).then(data => {
              if (data.result) {
                showTopAlert({
                  bsStyle: 'success',
                  content: i18n['general.remove_success']
                });
                getAccountGroupList();
              }
            });
          }
        });
        return;
      }

      if (res.result && !res.data) {
        showTipsModal({
          content: i18n['general.confirm_remove'],
          onConfirm: cb => {
            cb();
            deleteAccountGroup(selected.id).then(data => {
              if (data.result) {
                showTopAlert({
                  bsStyle: 'success',
                  content: i18n['general.remove_success']
                });
                getAccountGroupList();
              }
            });
          }
        });
        return;
      }
    });
  };

  save = (type, data) => {
    const {
      addAccountGroup,
      showTopAlert,
      editAccountGroup,
      getAccountGroupList
    } = this.props;
    if (type === 'add') {
      Promise.resolve(addAccountGroup(data)).then(res => {
        if (res.result) {
          showTopAlert({
            bsStyle: 'success',
            content: i18n['general.create_success']
          });
          this.setState({
            showUpdateAccountGroupModal: false
          });
          getAccountGroupList();
        }
      });
    }

    if (type === 'edit') {
      Promise.resolve(editAccountGroup(data)).then(res => {
        if (res.result) {
          showTopAlert({
            bsStyle: 'success',
            content: i18n['general.modify_success']
          });
          this.setState({
            showUpdateAccountGroupModal: false
          });
          getAccountGroupList();
        }
      });
    }
  };

  onSubmitName = (data, key, value, cb) => {
    if (!value || !value.length) {
      Message.error(i18n['settings.account_group_setting.emptyName']);
      return;
    }
    data[key] = value;
    this.save('edit', data);
    cb();
  };

  getFieldConfig = (key, data) => {
    if (key === 'groupName') {
      return {
        type: 'input',
        onSubmit: this.onSubmitName.bind(this, data, key),
        okText: i18n['general.apply'],
        cancelText: i18n['general.cancel']
      };
    }
    return null;
  };

  renderCell = ({ key, data, index, rowData }) => {
    const component =
      key === 'op' ? (
        <div className={cs['list-button']}>
          {/* <Icon
            className={`${cs['operationIcon']} main-color`}
            icon="edit-outline"
            onClick={this.toggleModal.bind(
              this,
              'UpdateAccountGroup',
              true,
              rowData
            )}
          /> */}
          <Icon
            className={`${cs['operationIcon']} main-color`}
            icon="delete-outline"
            onClick={this.showConfirmModal.bind(this, rowData)}
          />
        </div>
      ) : (
        data
      );
    const config = this.getFieldConfig(key, rowData);
    return (
      <TTd key={index} editable={!!config} fieldConfig={config}>
        {component}
      </TTd>
    );
  };

  render() {
    const { showUpdateAccountGroupModal, modalType } = this.state;
    const { groupList, currentGroup } = this.props;
    return (
      <div className={cs.body}>
        <SettingActionBar title={i18n['settings.account_group_setting.header']}>
          <Button
            type="primary"
            onClick={this.toggleModal.bind(
              this,
              'UpdateAccountGroup',
              true,
              undefined
            )}
          >
            <Icon icon="add-outline" />
            {i18n['settings.account_group_setting.add_group_title']}
          </Button>
        </SettingActionBar>
        <Card>
          <div>
            <div className={cs['list-table']}>
              <Table
                data={groupList}
                columns={this.columns}
                renderCell={this.renderCell}
              />
            </div>
            {groupList.length === 0 ? <NoDataView /> : undefined}
          </div>
          {showUpdateAccountGroupModal && (
            <UpdateAccountModal
              modaltype={modalType}
              onHide={this.toggleModal.bind(
                this,
                'UpdateAccountGroup',
                false,
                undefined
              )}
              onSave={this.save}
              currentGroup={currentGroup}
            />
          )}
        </Card>
      </div>
    );
  }
}
