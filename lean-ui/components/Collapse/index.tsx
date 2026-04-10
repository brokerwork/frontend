import * as React from 'react';
import * as PropTypes from "prop-types";
import * as classNames from 'classnames';
import CollapseItem from './item';

const prefix = "lean-collapse"
export interface CollapseProps {
  activeKey?: Array<string> | string;
  defaultActiveKey?: Array<string> | string;
  /** 手风琴效果 */
  forceActiveAll?: boolean;
  accordion?: boolean;
  onChange?: (key: string | string[]) => void;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}
function toArray(activeKey:any) {
  let currentActiveKey = activeKey;
  if (!Array.isArray(currentActiveKey)) {
    currentActiveKey = currentActiveKey ? [currentActiveKey] : [];
  }
  return currentActiveKey;
}
export default class Collapse extends React.Component<CollapseProps, any> {
  static Item = CollapseItem
  static propTypes = {
    /**折叠面板属性 */
    activeKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    defaultActiveKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    /**回调函数 */
    onChange: PropTypes.func,
    accordion: PropTypes.bool,
    /**DOM属性 */
    className: PropTypes.string,
    style: PropTypes.object,
    forceActiveAll: PropTypes.bool,
  };
  static defaultProps = {
    onChange() {},
    accordion: false,
  };
  constructor(props:CollapseProps) {
    super(props);

    const { activeKey, defaultActiveKey } = this.props;
    let currentActiveKey = defaultActiveKey;
    if ('activeKey' in this.props) {
      currentActiveKey = activeKey;
    }
    this.state = {
      activeKey: toArray(currentActiveKey),
    };
  }
  /**接收激活Item的key */
  componentWillReceiveProps(nextProps:CollapseProps) {
    if ('activeKey' in nextProps) {
      this.setState({
        activeKey: toArray(nextProps.activeKey),
      });
    }
  }
  /**根据accordion设置当前激活keys */
  setActiveKey(activeKey:any) {
    if (!('activeKey' in this.props)) {
      this.setState({ activeKey });
    }
    this.props.onChange(this.props.accordion ? activeKey[0] : activeKey);
  }
  onClickItem(key:string) {
    let activeKey = this.state.activeKey;
    if (this.props.accordion) {
      activeKey = activeKey[0] === key ? [] : [key];
    } else {
      activeKey = [...activeKey];
      const index = activeKey.indexOf(key);
      const isActive = index > -1;
      if (isActive) {
        // 已经展开的Item，点击后取消激活状态
        activeKey.splice(index, 1);
      } else {
        activeKey.push(key);
      }
    }
    this.setActiveKey(activeKey);
  }
  /**渲染children */
  getItems() {
    const activeKey = this.state.activeKey;
    const { forceActiveAll, accordion } = this.props;
    const newChildren:Array<any> = [];

    React.Children.forEach(this.props.children, (child:any, index) => {
      if (!child) return;
      //如果children没有默认的key，则用序号作为key
      const key = child.key || String(index);
      const { title, titleClass, disabled } = child.props;
      let isActive = false;
      let isClickable = !disabled;

      if(forceActiveAll){
          isActive = true;
      } else if (accordion) {
        isActive = activeKey[0] === key;
      } else {
        isActive = activeKey.indexOf(key) > -1;
      }
      const props = {
        key,
        title,
        titleClass,
        isActive,
        children: child.props.children,
        onItemClick: isClickable ? () => this.onClickItem(key) : null,
      };

      newChildren.push(React.cloneElement(child, props));
    });

    return newChildren;
  }
  render() {
    const {
      children,
      className,
      style,
     } = this.props;
    const classes = classNames(prefix, className);
    return <div className={classes} style={style}>{this.getItems()}</div>
  }
}
export { CollapseItem };
