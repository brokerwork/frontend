import UserCountModal from '../UserCountModal';
import UpdateLevelModal from '../UpdateLevelModal';
import SetDefaultParamsModal from '../SetDefaultParamsModal';
import { Table as UiTable, Button, Icon, Message } from 'lean-ui';
import { LEVEL_SETTING_HEADER } from '../../constant';
const { Td, Th } = UiTable;
import i18n from 'utils/i18n';
import cs from './LevelSetting.less';
import fieldToEditConfig from 'utils/fieldToEditConfig';
import CommonHeader from 'components/v2/CommonHeader';

export default class LevelSetting extends PureComponent {
  state = {
    showUserCountDetailModal: false,
    showUpdateLevelModal: false,
    showSetDefaultParamsModal: false,
    type: 'add',
    addDisabled: false
  };

  componentWillMount() {
    const { getLevelList } = this.props;
    getLevelList();
  }

  toggleModal = (type, toggle, selected) => {
    const {
      getUserCountDetail,
      updateCurrentLevel,
      getDefaultLevel,
      getDefaultLevelList
    } = this.props;

    switch (type) {
      case 'UserCountDetail':
        if (toggle) {
          getUserCountDetail({ id: selected.id });
        }
        break;
      case 'UpdateLevel':
        if (toggle) {
          if (selected) {
            updateCurrentLevel(selected);
            this.setState({
              type: 'edit'
            });
          }

          if (!selected) {
            this.setState({
              type: 'add'
            });
          }
        }
        break;
      case 'SetDefaultParams':
        if (toggle) {
          updateCurrentLevel(selected);
          getDefaultLevelList(selected.id).then(res => {
            if (res.result) {
              getDefaultLevel(selected.id);
            }
          });
        }
    }

    this.setState({
      [`show${type}Modal`]: toggle
    });
  };

  updateLevel = (type, newLevel) => {
    const { levelList, addLevel, editLevel, getLevelList } = this.props;
    if (!newLevel['sid']) {
      newLevel['sid'] = levelList.length + 1;
    }

    if (type === 'add') {
      Promise.resolve(addLevel(newLevel)).then(res => {
        if (res.result) {
          Message.success(i18n['general.create_success']);
          this.setState({
            showUpdateLevelModal: false
          });
          getLevelList();
        }
      });
    }

    if (type === 'edit') {
      Promise.resolve(editLevel(newLevel)).then(res => {
        if (res.result) {
          Message.success(i18n['general.modify_success']);
          this.setState({
            showUpdateLevelModal: false
          });
          getLevelList();
        }
      });
    }
  };

  showConfirmModal = selected => {
    const { showTipsModal, deleteLevel, getLevelList } = this.props;
    showTipsModal({
      content: i18n['general.confirm_remove'],
      onConfirm: cb => {
        cb();
        deleteLevel(selected.id).then(res => {
          if (res.result) {
            Message.success(i18n['general.remove_success']);
            getLevelList();
          }
        });
      }
    });
  };
  // 生成header的部分，排序和特殊处理的header
  renderHeadCell = ({ item, index, fixed }) => {
    return (
      <Th key={index} fixed={fixed}>
        {item.label}
      </Th>
    );
  };
  onFieldEdit = (source, key, value, cb) => {
    const { editLevel, getLevelList } = this.props;
    const newLevel = Object.assign({}, source, { name: value });
    Promise.resolve(editLevel(newLevel)).then(res => {
      if (res.result) {
        cb();
        Message.success(i18n['general.modify_success']);
        getLevelList();
      }
    });
  };
  _renderCellNew = ({ data, index, rowData, listData }) => {
    let content = null;
    let clickHandler = null;
    let title;
    const key = listData.value;
    title = content = rowData[key];
    switch (key) {
      case 'userCount':
        content = (
          <a
            onClick={this.toggleModal.bind(
              this,
              'UserCountDetail',
              true,
              rowData
            )}
          >
            {rowData.userCount}
          </a>
        );
        break;
      case 'actions':
        content = (
          <div>
            <Icon
              className={`${cs['operationIcon']} main-color`}
              icon="delete-outline"
              onClick={this.showConfirmModal.bind(this, rowData)}
            />
            <Icon
              icon="set-outline"
              className={`${cs['operationIcon']} main-color`}
              onClick={this.toggleModal.bind(
                this,
                'SetDefaultParams',
                true,
                rowData
              )}
            />
          </div>
        );
        title = '';
        break;
      default:
        title = content = rowData[key];
        break;
    }
    if (key === 'name') {
      const fieldConfig = fieldToEditConfig(
        { ...rowData, fieldType: 'text', validateType: { required: true } },
        rowData[key],
        this.onFieldEdit.bind(this, rowData, key)
      );
      return (
        <Td
          key={key}
          className={cs['td-maxwidth']}
          editable
          title={title}
          fieldConfig={fieldConfig}
        >
          {content}
        </Td>
      );
    }
    return (
      <Td
        key={key}
        className={cs['td-maxwidth']}
        onClick={clickHandler}
        title={title}
      >
        {content}
      </Td>
    );
  };

  render() {
    const {
      showUserCountDetailModal,
      type,
      showUpdateLevelModal,
      showSetDefaultParamsModal
    } = this.state;
    const {
      userCountList,
      levelList,
      currentLevel,
      submit,
      updateDefaultLevel,
      getDefaultLevel,
      defaultLevel,
      defaultLevelList,
      brandInfo
    } = this.props;
    const isPro = brandInfo.topVersionId === 'TV003';
    return (
      <div className={cs.container}>
        <CommonHeader
          title={
            i18n[
              'settings.left_menu.rebate_setting.sub_menu.user_hierarchy_setting'
            ]
          }
          menus={[
            { value: i18n['page.title.settings'] },
            { value: i18n['settings.left_menu.rebate_setting'] }
          ]}
        >
          <Button
            className={'pull-right'}
            type={
              isPro
                ? levelList.length >= 100
                  ? 'default'
                  : 'primary'
                : levelList.length >= 50
                  ? 'default'
                  : 'primary'
            }
            disabled={isPro ? levelList.length >= 100 : levelList.length >= 50}
            onClick={this.toggleModal.bind(
              this,
              'UpdateLevel',
              true,
              undefined
            )}
          >
            <Icon icon="add-outline" />
            {i18n['settings.level_setting.add_level_title']}
          </Button>
        </CommonHeader>
        <UiTable
          data={levelList}
          columns={LEVEL_SETTING_HEADER}
          fixedHeader
          renderCell={this._renderCellNew}
          renderHeadCell={this.renderHeadCell}
        />

        {showUserCountDetailModal ? (
          <UserCountModal
            onHide={this.toggleModal.bind(
              this,
              'UserCountDetail',
              false,
              undefined
            )}
            data={userCountList}
          />
        ) : (
          undefined
        )}
        {showUpdateLevelModal ? (
          <UpdateLevelModal
            isPro={isPro}
            onHide={this.toggleModal.bind(
              this,
              'UpdateLevel',
              false,
              undefined
            )}
            type={type}
            onSave={this.updateLevel}
            currentLevel={currentLevel}
            length={levelList.length}
          />
        ) : (
          undefined
        )}
        {showSetDefaultParamsModal ? (
          <SetDefaultParamsModal
            visible={showSetDefaultParamsModal}
            onHide={this.toggleModal.bind(this, 'SetDefaultParams', false)}
            submit={submit}
            getDefaultLevel={getDefaultLevel}
            updateDefaultLevel={updateDefaultLevel}
            defaultLevel={defaultLevel}
            levelList={defaultLevelList}
            currentLevel={currentLevel}
          />
        ) : null}
      </div>
    );
  }
}
