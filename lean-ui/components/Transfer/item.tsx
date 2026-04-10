import * as React from 'react';
import * as classNames from 'classnames';
import * as PureRenderMixin from 'rc-util/lib/PureRenderMixin';
import Lazyload from 'react-lazy-load';
import Checkbox from '../Checkbox';
import {
  SortableElement
} from 'react-sortable-hoc';

export default class Item extends React.Component<any, any> {
  shouldComponentUpdate(...args: any[]) {
    return PureRenderMixin.shouldComponentUpdate.apply(this, args);
  }
  render() {
    const { renderedText, renderedEl, item, lazy, checked, prefixCls, onClick, key, index, sortable } = this.props;
    const className = classNames({
      [`${prefixCls}-content-item`]: true,
      [`${prefixCls}-content-item-sortable`]: sortable,
      [`${prefixCls}-content-item-disabled`]: item.disabled,
    });
    const ListItem = SortableElement(() =>
      <li
      className={className}
      title={renderedText}
      key={key}
      onClick={item.disabled ? undefined : (e) => { e.preventDefault(); onClick(item)}}
      >
        <Checkbox checked={checked} disabled={item.disabled}  />
        <span>{renderedEl}</span>
      </li>
    );

    let children: JSX.Element | null = null;
    if (lazy) {
      const lazyProps = {
        height: 32,
        offset: 500,
        throttle: 0,
        debounce: false,
        ...lazy,
      };
      children = <Lazyload {...lazyProps}><ListItem index={index}/></Lazyload>;
    } else {
      children = <ListItem index={index}/>;
    }

    return children;
  }
}
