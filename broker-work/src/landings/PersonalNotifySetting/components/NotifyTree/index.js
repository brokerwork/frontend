import cs from './NotifyTree.less';
import Checkbox from 'components/Checkbox';
import Tips from 'components/Tips';
// 示例
// <SelectTree
//     onChange={this.getRight}
//     selected={rights}
//     data={data}
// />
// onChange: 在每次改变的时候，都会抛出已经选择的所有结果
// selected: 已选中的项目
// data: 待选择的所有项目

export default class NotifyTree extends PureComponent {
  constructor(props) {
    super(props);
    const { data, selected } = this.props;
    const selectedObj = {};
    selected.forEach(item => (selectedObj[item] = true));
    // 扁平化展开
    let nodeInfo = this.flatteningData(data, selectedObj, {});
    // 初始化状态查找修改
    nodeInfo = this.initialDataStatusChange(data, { ...nodeInfo });
    this.state = { nodeInfo };
  }

  initialDataStatusChange = (data, nodeInfo) => {
    data.forEach((item, index) => {
      const { value } = item;
      const { status, children, pid } = nodeInfo[value];
      // 当前节点未选中,或者没有子节点, 无需修改
      if (status === 1 && children.length === 0) return;
      // 在子节点中查找不是选中状态的节点
      const childStatus = children.some(v => nodeInfo[v]['status'] !== 0);
      // 如果有子节点为非选中状态, 修改当前节点的及其父节点的状态
      if (childStatus) {
        nodeInfo[value]['status'] = status === 1 ? status : 2;
        pid.forEach(
          v => (nodeInfo[v]['status'] = nodeInfo[v]['status'] === 1 ? 1 : 2)
        );
      }
      if (item.children && item.children.length > 0) {
        this.initialDataStatusChange(item.children, nodeInfo);
      }
    });
    return nodeInfo;
  };

  // 数据扁平化处理
  flatteningData(data, selectedObj, obj = {}, pid = []) {
    data.forEach(item => {
      let children = [];
      if (Array.isArray(item.children) && item.children.length > 0) {
        children = item.children.map(v => {
          return v.value;
        });
        this.flatteningData(item.children, selectedObj, obj, [
          ...pid,
          item.value
        ]);
      }
      obj[item.value] = {
        ...item,
        pid,
        // status 0未选项, 1选中, 2部分选中
        // 扁平化处理时, 只标记选中, 未选中的情况
        status: selectedObj[item.value] ? 1 : 0,
        children
      };
    });
    return obj;
  }

  //标记收起, 展开元素
  toggleFoldStatus = value => {
    const { nodeInfo } = this.state;
    const node = nodeInfo[value];
    node['foldStatus'] = !node['foldStatus'];
    this.setState({
      ...nodeInfo,
      [value]: { ...node }
    });
  };

  onChange = value => {
    const { onChange } = this.props;
    const { nodeInfo } = this.state;
    const node = nodeInfo[value];
    const { status, pid, children } = node;
    node['status'] =
      status === 2 ? 1 : status ? this.nodeStatusCheck(node, nodeInfo, 0) : 1;
    let nextNodeInfo = {
      ...nodeInfo,
      [value]: { ...node }
    };
    // 父级选择状态修改
    if (pid.length > 0) {
      nextNodeInfo = this.modifyParentNodeStatus(
        { ...nextNodeInfo },
        node['status'],
        [...pid]
      );
    }

    // 触发onChange
    if (onChange) {
      const selectedList = this.getSelectedList(nextNodeInfo);
      onChange(selectedList);
    }

    this.setState(nextNodeInfo);
  };

  // onChange时子级选择状态修改
  modifyChildrenNodeStatus(nodeInfo, status, children) {
    children.forEach(item => {
      const node = nodeInfo[item];
      node['status'] = status;
      if (node['children'].length > 0) {
        this.modifyChildrenNodeStatus(nodeInfo, status, node['children']);
      }
    });
    return nodeInfo;
  }

  // 向上查找并改变上级节点状态
  modifyParentNodeStatus(nodeInfo, status, pid) {
    if (status === 1) {
      const lastPid = pid.pop();
      nodeInfo[lastPid]['status'] = this.nodeStatusCheck(
        nodeInfo[lastPid],
        nodeInfo
      );
      if (pid.length > 0) {
        this.modifyParentNodeStatus(nodeInfo, status, pid);
      }
    } else {
      // 从下级往上级查找，所以需要反向
      pid.reverse().forEach(item => {
        nodeInfo[item]['status'] = this.nodeStatusCheck(
          nodeInfo[item],
          nodeInfo
        );
      });
    }
    return nodeInfo;
  }

  //status 0=不选， 1=选中，2=半选
  nodeStatusCheck = (node, nodeInfo, will) => {
    const { children } = node;
    let count = 0;
    let status;
    children.forEach(item => {
      if (status === 2) return;
      if (nodeInfo[item]['status'] === 2) {
        status = node['status'] !== 1 ? 2 : node['status'];
        return;
      }
      if (nodeInfo[item]['status'] !== 0) {
        ++count;
      }
    });
    if (status === 2) {
      return status;
    }
    if (count === 0) {
      status = node['status'] === 1 && will !== 0 ? 1 : 0;
    } else if (count === children.length) {
      status = node['status'] === 1 && will !== 0 ? 1 : 2;
    } else {
      status = node['status'] === 1 ? 1 : 2;
    }
    return status;
  };
  // 获取已选中项列表
  getSelectedList(nodeInfo) {
    const selected = [];
    for (let k in nodeInfo) {
      if (nodeInfo[k]['status'] === 0 || nodeInfo[k]['status'] === 2) continue;
      selected.push(k);
    }
    return selected;
  }
  getUnsafeMap = () => {
    const { data } = this.props;
    return this.checkIsSafeData({}, { children: data });
  };
  //判断是否是警告数据
  checkIsSafeData = (unsafeMap, item) => {
    const { safeData } = this.props;
    const { nodeInfo } = this.state;
    const node = nodeInfo[item.value];
    let isSafe = true;
    if (!safeData) return unsafeMap;
    const getNodeSafeInfo = () => {
      return (
        !node ||
        !node.status ||
        safeData.find(safeId => Number(safeId) === Number(item.value))
      );
    };

    const getChildrensafeInfo = () => {
      const hasChildren =
        Array.isArray(item.children) && item.children.length > 0;
      if (hasChildren) {
        return item.children.reduce(
          (childUnsafeMap, child) =>
            this.checkIsSafeData(childUnsafeMap, child),
          {}
        );
      } else {
        return {};
      }
    };

    isSafe = getNodeSafeInfo();
    const unsafeChildren = getChildrensafeInfo();
    const showChildBadge =
      Object.keys(unsafeChildren).length &&
      (!node || (node && !node.foldStatus));
    const showBadge = !isSafe || showChildBadge;
    if (showBadge) {
      unsafeMap[item.value] = true;
    }
    return Object.assign(unsafeMap, unsafeChildren);
  };

  render() {
    const { data, tips, onTipsClick, unsafeNotice } = this.props;
    const { nodeInfo } = this.state;
    const unsafeMap = this.getUnsafeMap();
    return (
      <div>
        {Object.keys(unsafeMap).length ? (
          <div className={cs['unsafe-notice']}>
            <i className={`${cs['safe-warning']} fa fa-exclamation-circle`} />
            <span>{unsafeNotice}</span>
          </div>
        ) : (
          undefined
        )}
        <TreeNode
          data={data}
          onChange={this.onChange}
          nodeInfo={nodeInfo}
          foldStatus={true}
          toggleFoldStatus={this.toggleFoldStatus}
          onTipsClick={onTipsClick}
          tips={tips}
          unsafeMap={unsafeMap}
        />
      </div>
    );
  }
}

const TreeNode = ({
  data,
  onChange,
  nodeInfo,
  foldStatus,
  toggleFoldStatus,
  onTipsClick = function() {},
  tips = {},
  unsafeMap
}) => (
  <ul className={`${cs['select-tree']} ${!foldStatus ? cs['hide'] : ''}`}>
    {data.map((item, index) => {
      const hasChildren =
        Array.isArray(item.children) && item.children.length > 0;
      const node = nodeInfo[item.value];
      return (
        <li key={index} data-value={item.entityNo}>
          {hasChildren ? (
            <i
              onClick={toggleFoldStatus.bind(this, item.value)}
              className={`fa fa-${
                !node['foldStatus'] ? 'plus' : 'minus'
              }-square-o ${cs['icon']}`}
            />
          ) : (
            undefined
          )}
          <Checkbox
            className={cs['checkbox']}
            type="checkbox"
            checked={node['status']}
            onChange={onChange.bind(this, item.value)}
          >
            {item.label}
          </Checkbox>
          {item.tips && (
            <Tips onClick={onTipsClick.bind(this, item.entityNo)} align="right">
              <div className={cs['tips-content']}>{tips[item.entityNo]}</div>
            </Tips>
          )}
          {unsafeMap[item.value] ? (
            <i className={`${cs['safe-warning']} fa fa-exclamation-circle`} />
          ) : (
            undefined
          )}
          {/**递归子选项**/}
          {hasChildren ? (
            <TreeNode
              data={item.children}
              nodeInfo={nodeInfo}
              onChange={onChange}
              toggleFoldStatus={toggleFoldStatus}
              foldStatus={node['foldStatus']}
              onTipsClick={onTipsClick}
              tips={tips}
              unsafeMap={unsafeMap}
            />
          ) : (
            undefined
          )}
        </li>
      );
    })}
  </ul>
);
