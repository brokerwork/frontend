import TableEdit from '../TableEdit';
import Button from 'components/Button';
import Select from 'components/Select';
import cs from './CustomNav.less';
import i18n from 'utils/i18n';
import AddNavModal from '../AddNavModal';
import EditNavModal from '../EditNavModal';
import AuthModal from '../AuthModal';
import { NAC_CUSTOM_TABLE_HEADER } from '../../constant';
import _ from 'lodash';

export default class CustomNav extends PureComponent {
  constructor(props) {
    super(props);
    this.props.getMenuList();
    this.props.getRoleList();
  }
  state = {
    reset: false,
    isAddModalVisible: false,
    isEditModalVisible: false,
    isAuthModalVisible: false,
    editData: null
  };
  onChange = data => {
    this.dataMap = data;
  };
  dataMap = {};
  onConfirm = (item, cb) => {
    // 对象没有key（未操作）或者对象有key，key的值（对象）里面value不能没有
    const id = item.id;
    let notEmpty =
      !Object.keys(this.dataMap).length || (this.dataMap[id] && Object.values(this.dataMap[id]).every(el => !!el));
    if (!notEmpty) {
      this.props.showTopAlert({
        content: i18n['twapp.brand_setting.no.empty']
      });
      return;
    }
    this.props
      .updateMenus({
        ...item,
        ...{ message: this.dataMap[id] }
      })
      .then(rs => {
        if (rs.result) {
          this.props.getMenuList();
          cb();
        }
      });
  };

  // 新增导航
  addNav = () => {
    this.modalVisible('isAddModalVisible', true);
  };
  // 编辑导航内容
  editNav = item => {
    const { geMenuDetails } = this.props;
    geMenuDetails(item.id).then(res => {
      if (res.result) {
        this.modalVisible('isEditModalVisible', true);
      }
    });
    this.setState({ editData: item });
  };
  modalVisible = (modal, visible) => {
    this.setState({
      [modal]: visible
    });
  };
  operateMenu = (isEnabled, item) => {
    const { showTipsModal, getMenuList, menuEnabled, showTopAlert, menuList } = this.props;
    let content = '';
    // 如果是一级菜单
    if (item.parent === '0') {
      if (isEnabled) {
        content = i18n['broker.brand_setting.custom_nav.enabled_level_one_tips'];
      } else {
        content = i18n['broker.brand_setting.custom_nav.disabled_level_one_tips'];
      }
    } else {
      // 不是一级菜单
      if (isEnabled) {
        // 如果一级菜单启用了
        const parentItem = menuList.find(el => el.key === item.parent) || {};
        if (parentItem.enabled) {
          content = i18n['broker.brand_setting.custom_nav.enabled_level_one_tips'];
        } else {
          content = i18n['broker.brand_setting.custom_nav.enabled_level_two_tips'];
        }
      } else {
        content = i18n['broker.brand_setting.custom_nav.disabled_level_two_tips'];
      }
    }
    const params = {
      id: item.id,
      enabled: isEnabled
    };
    showTipsModal({
      header: i18n['common.tips.risk'],
      content,
      onConfirm: cb => {
        menuEnabled(params).then(res => {
          if (res.result) {
            showTopAlert({
              style: 'success',
              content: i18n['general.operate_success']
            });
            getMenuList();
            cb();
          }
        });
      },
      onCancel: cb => {
        cb();
      }
    });
  };
  // 重组menu，使列表展示为一级菜单，接二级菜单;
  configMenuList = () => {
    const { menuList } = this.props;
    const copyMenu = _.cloneDeep(menuList);
    const resetMenu = {};
    let resetMenuList = [];
    if (menuList.some(el => el.order)) {
      resetMenuList = _.sortBy(menuList, ['order']);
      return resetMenuList;
    }
    copyMenu.forEach(item => {
      const copyItem = _.cloneDeep(item);
      if (item.parent === '0') {
        const keyName = copyItem.id;
        resetMenu[keyName] = [];
        resetMenu[keyName].push(item);
      } else {
        const menuKeys = Object.keys(resetMenu);
        if (menuKeys.includes(item.parent)) {
          resetMenu[item.parent].push(item);
        }
      }
    });
    // 组成数组
    Object.keys(resetMenu).forEach(menu => {
      resetMenuList = [...resetMenuList, ...resetMenu[menu]];
    });
    return resetMenuList;
  };
  // 权限设置
  openAuthSetting = item => {
    this.modalVisible('isAuthModalVisible', true);
    this.setState({ editData: item });
  };
  arrTans(arr, oldIndex, newIndex) {
    const oldId = arr[oldIndex];
    arr.splice(oldIndex, 1);
    arr.splice(newIndex, 0, oldId);

    return arr;
  }
  sortSetting = (item, sort) => {
    const { menuSorts, getMenuList, showTopAlert } = this.props;
    const resetMenuList = this.configMenuList();
    let newIndex;
    let oldIndex = resetMenuList.findIndex(menu => menu.id === item.id); // 当前需要排序的index
    let end;
    if (sort === 'down') {
      newIndex = oldIndex + 1;
      end = this.arrTans(resetMenuList, oldIndex, newIndex);
    } else {
      newIndex = oldIndex - 1;
      end = this.arrTans(resetMenuList, oldIndex, newIndex);
    }
    const params = end.map(item => item.id);
    menuSorts(params).then(res => {
      if (res.result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.operate_success']
        });
        getMenuList();
      }
    });
  };
  render() {
    const {
      brandInfo: { languages = [] },
      submitForm,
      showTopAlert,
      getMenuList,
      updateMenus,
      menuDetails,
      menuList,
      roleList
    } = this.props;
    const { reset, isAddModalVisible, isEditModalVisible, editData, isAuthModalVisible } = this.state;
    let headerData = languages
      .filter(el => {
        return el.enabled;
      })
      .map(el => {
        return {
          key: el.value,
          value: el.label
        };
      });
    headerData.push({ key: 'opterate', value: i18n['customer.bill.invoice.action'] });
    headerData = [...NAC_CUSTOM_TABLE_HEADER, ...headerData];
    const resetMenuList = this.configMenuList();
    return (
      <div className={cs['custom_nav']}>
        <div className={cs['head']}>
          <div className={cs.right}>
            <Button className={cs['button']} style="primary" onClick={this.addNav}>
              {i18n['twapp.brand_setting.custom_nav.add']}
            </Button>
          </div>
        </div>
        <TableEdit
          reset={reset}
          headerData={headerData}
          data={resetMenuList}
          onChange={this.onChange}
          onConfirm={this.onConfirm}
          editNav={this.editNav}
          operateMenu={this.operateMenu}
          setAuth={this.openAuthSetting}
          sortSetting={this.sortSetting}
        />
        {isAddModalVisible && (
          <AddNavModal
            onClose={this.modalVisible.bind(this, 'isAddModalVisible', false)}
            submitForm={submitForm}
            showTopAlert={showTopAlert}
            addMenu={updateMenus}
            getMenuList={getMenuList}
            menuList={menuList}
          />
        )}
        {isEditModalVisible && (
          <EditNavModal
            onClose={this.modalVisible.bind(this, 'isEditModalVisible', false)}
            submitForm={submitForm}
            editData={{ ...editData, ...menuDetails }}
            showTopAlert={showTopAlert}
            editMenu={updateMenus}
            getMenuList={getMenuList}
          />
        )}
        {isAuthModalVisible && (
          <AuthModal
            onClose={this.modalVisible.bind(this, 'isAuthModalVisible', false)}
            submitForm={submitForm}
            editData={editData}
            showTopAlert={showTopAlert}
            editMenu={updateMenus}
            getMenuList={getMenuList}
            roleList={roleList}
            menuList={menuList}
          />
        )}
      </div>
    );
  }
}
