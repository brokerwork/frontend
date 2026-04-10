import TableEdit from 'components/TableEdit';
import Button from 'components/Button';
import Select from 'components/Select';
import cs from './CustomNav.less';
import i18n from 'utils/i18n';
import AddNavModal from '../AddNavModal';
import EditNavModal from '../EditNavModal';
import { NAC_CUSTOM_TABLE_HEADER } from '../../constant';
import _ from 'lodash';

export default class CustomNav extends PureComponent {
  constructor(props) {
    super(props);
    this.props.getMenuList(this.currentOption);
  }
  state = {
    reset: false,
    isAddModalVisible: false,
    isEditModalVisible: false,
    editData: null
  };
  onChange = data => {
    this.dataMap = data;
  };
  dataMap = {};
  onConfirm = (id, cb) => {
    // 对象没有key（未操作）或者对象有key，key的值（对象）里面value不能没有
    let notEmpty =
      !Object.keys(this.dataMap).length || (this.dataMap[id] && Object.values(this.dataMap[id]).every(el => !!el));
    if (!notEmpty) {
      this.props.showTopAlert({
        content: i18n['twapp.brand_setting.no.empty']
      });
      return;
    }
    this.props
      .addOrEditMenu({
        id,
        message: this.dataMap[id]
      })
      .then(rs => {
        if (rs.result) {
          this.props.getMenuList(this.currentOption);
          cb();
        }
      });
  };
  reset = () => {
    this.props.showTipsModal({
      content: i18n['twapp.brand_setting.del_nav'],
      onConfirm: cb => {
        this.props.resetMenu(this.currentOption).then(rs => {
          if (rs.result) {
            this.props.showTopAlert({
              style: 'success',
              content: i18n['general.operate_success']
            });
            cb();
            this.setState(
              {
                reset: true
              },
              () => {
                this.props.getMenuList(this.currentOption);
              }
            );
          }
        });
      }
    });
  };
  options = [
    { value: 'web', label: i18n['twapp.brand_setting.pc'] },
    { value: 'mobile', label: i18n['twapp.brand_setting.mobile'] }
  ];
  currentOption = this.options[0].value;
  changePlat = value => {
    this.currentOption = value;
    this.setState(
      {
        reset: true
      },
      () => {
        this.props.getMenuList(this.currentOption);
      }
    );
  };

  // 新增导航
  addNav = () => {
    this.modalVisible('isAddModalVisible', true);
  };
  // 编辑导航内容
  editNav = item => {
    this.modalVisible('isEditModalVisible', true);
    this.setState({
      editData: item
    });
  };
  modalVisible = (modal, visible) => {
    this.setState({
      [modal]: visible
    });
  };
  operateMenu = (type, item) => {
    const { showTipsModal, getMenuList, enableOrDisableMenu, showTopAlert, menuList } = this.props;
    let content = '';
    // 如果是一级菜单
    if (item.parent === '0') {
      if (type === 'enable') {
        content = i18n['twapp.brand_setting.custom_nav.enabled_level_one_tips'];
      } else {
        content = i18n['twapp.brand_setting.custom_nav.disabled_level_one_tips'];
      }
    } else {
      // 不是一级菜单
      if (type === 'enable') {
        // 如果一级菜单启用了
        const parentItem = menuList.find(el => el.key === item.parent) || {};
        if (parentItem.enabled) {
          content = i18n['twapp.brand_setting.custom_nav.enabled_level_one_tips'];
        } else {
          content = i18n['twapp.brand_setting.custom_nav.enabled_level_two_tips'];
        }
      } else {
        content = i18n['twapp.brand_setting.custom_nav.disabled_level_two_tips'];
      }
    }
    showTipsModal({
      header: i18n['common.tips.risk'],
      content,
      onConfirm: cb => {
        enableOrDisableMenu(type, item.id).then(res => {
          if (res.result) {
            showTopAlert({
              style: 'success',
              content: i18n['general.operate_success']
            });
            getMenuList(this.currentOption);
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
    copyMenu.forEach(item => {
      const copyItem = _.cloneDeep(item);
      if (item.parent === '0') {
        const keyName = copyItem.key;
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
  render() {
    const {
      brandInfo: { languages = [] },
      submitForm,
      showTopAlert,
      addOrEditMenu,
      getMenuList,
      enableOrDisableMenu
    } = this.props;
    const { reset, editData, isAddModalVisible, isEditModalVisible } = this.state;
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
          <div className={cs.left}>
            <Select
              className={cs['select']}
              options={this.options}
              onChange={this.changePlat}
              value={this.currentOption}
            />
            <Button className={cs['button']} style="primary" onClick={this.reset}>
              {i18n['twapp.brand_setting.reset_menu']}
            </Button>
          </div>
          {this.currentOption === 'web' && (
            <div className={cs.right}>
              <Button className={cs['button']} style="primary" onClick={this.addNav}>
                {i18n['twapp.brand_setting.custom_nav.add']}
              </Button>
            </div>
          )}
        </div>
        <TableEdit
          reset={reset}
          headerData={headerData}
          data={resetMenuList}
          onChange={this.onChange}
          onConfirm={this.onConfirm}
          editNav={this.editNav}
          operateMenu={this.operateMenu}
          currentOption={this.currentOption}
        />
        {isAddModalVisible && (
          <AddNavModal
            onClose={this.modalVisible.bind(this, 'isAddModalVisible', false)}
            submitForm={submitForm}
            showTopAlert={showTopAlert}
            addMenu={addOrEditMenu}
            platForm={this.currentOption}
            getMenuList={getMenuList}
          />
        )}
        {isEditModalVisible && (
          <EditNavModal
            onClose={this.modalVisible.bind(this, 'isEditModalVisible', false)}
            submitForm={submitForm}
            editData={editData}
            showTopAlert={showTopAlert}
            editMenu={addOrEditMenu}
            platForm={this.currentOption}
            getMenuList={getMenuList}
          />
        )}
      </div>
    );
  }
}
