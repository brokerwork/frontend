import { Tree } from 'lean-ui';
import { get } from 'utils/ajax';
import _ from 'lodash';
const TreeNode = Tree.TreeNode;
export default class AuthTree extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menuLists: [],
      originMenuList: [],
      defaultCheckedKeys: [],
      defaultExpandedKeys: []
    };
  }
  onCheck = val => {
    const { onChange } = this.props;
    onChange(val);
  };

  componentDidMount() {
    this.getMenuList('web').then(res => {
      if (res.result) {
        this.setState({
          menuLists: this.configMenuList(res.data),
          originMenuList: res.data
        });
      }
    });
  }
  // 获取菜单列表
  getMenuList = platform => {
    return get({
      url: `/v2/os/products/menu/sc/${platform}`
    });
  };
  // 过滤未启用菜单
  // 重组菜单结构
  configMenuList = menuLists => {
    const copyMenu = menuLists.filter(item => item.enabled);
    const resetMenu = {};
    let resetMenuList = [];
    copyMenu.forEach(item => {
      const copyItem = _.cloneDeep(item);
      if (item.parent === '0') {
        const keyName = copyItem.key;
        resetMenu[keyName] = item;
        resetMenu[keyName].children = [];
      } else {
        const menuKeys = Object.keys(resetMenu);
        if (menuKeys.includes(item.parent)) {
          resetMenu[item.parent].children.push(item);
        }
      }
    });
    // 组成数组
    Object.keys(resetMenu).forEach(menu => {
      resetMenuList.push(resetMenu[menu]);
    });
    return resetMenuList;
  };
  getDefaultExpand = value => {
    const { originMenuList } = this.state;
    let defaultExpand = [];
    value &&
      originMenuList.forEach(menu => {
        if (value.includes(menu.key)) {
          if (menu.parent !== '0') {
            defaultExpand.push(menu.parent);
          }
        }
      });
    return _.uniq(defaultExpand);
  };
  render() {
    const { value, disabled } = this.props;
    const { menuLists } = this.state;
    // const defaultExpandedKeys = this.getDefaultExpand(value);
    return (
      <div>
        {menuLists && menuLists.length && (
          <Tree
            checkable={!disabled}
            // expandedKeys={defaultExpandedKeys}
            checkedKeys={value ? value : []}
            onCheck={this.onCheck}
          >
            {menuLists.map(item => {
              return (
                <TreeNode title={item.message['zh-CN']} key={item.key} disabled={disabled}>
                  {item.children &&
                    item.children.length > 0 &&
                    item.children.map(sub => (
                      <TreeNode title={sub.message['zh-CN']} key={sub.key} disabled={disabled}></TreeNode>
                    ))}
                </TreeNode>
              );
            })}
          </Tree>
        )}
      </div>
    );
  }
}
