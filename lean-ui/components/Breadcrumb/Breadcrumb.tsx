import * as React from 'react';
import * as PropTypes from 'prop-types';
import { cloneElement } from 'react';
import warning from '../utils/warning';
import BreadcrumbItem from './BreadcrumbItem';
import * as classNames from 'classnames';
import Icon from '../Icon';

export interface Route {
  path: string;
  breadcrumbName: string;
}


export interface BreadcrumbProps {
  prefixCls?: string;
  routes?: Route[];
  params?: any;
  separator?: React.ReactNode;
  itemRender?: (route: any, params: any, routes: Array<any>, paths: Array<string>) => React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

function getBreadcrumbName(route: Route, params: any) {
  if (!route.breadcrumbName) {
    return null;
  }
  const paramsKeys = Object.keys(params).join('|');
  const name = route.breadcrumbName.replace(
    new RegExp(`:(${paramsKeys})`, 'g'),
    (replacement, key) => params[key] || replacement,
  );
  return name;
}

function defaultItemRender(route: Route, params: any, routes: Route[], paths: string[]) {
  const isLastItem = routes.indexOf(route) === routes.length - 1;
  const name = getBreadcrumbName(route, params);
  return isLastItem
    ? <span>{name}</span>
    : <a href={`#/${paths.join('/')}`}>{name}</a>;
}

export default class Breadcrumb extends React.Component<BreadcrumbProps, any> {
  static Item: any;

  static defaultProps = {
    prefixCls: 'lean-breadcrumb',
    separator: <Icon icon="arrow-right"/>,
  };

  static propTypes = {
    prefixCls: PropTypes.string,
    separator: PropTypes.node,
    routes: PropTypes.array,
    params: PropTypes.object,
    itemRender: PropTypes.func
  };

  render() {
    let crumbs;
    const {
      separator, prefixCls, style, className, routes, params = {},
      children, itemRender = defaultItemRender,
    } = this.props;
    if (routes && routes.length > 0) {
      const paths: string[] = [];
      crumbs = routes.map((route) => {
        route.path = route.path || '';
        let path: string = route.path.replace(/^\//, '');
        Object.keys(params).forEach(key => {
          path = path.replace(`:${key}`, params[key]);
        });
        if (path) {
          paths.push(path);
        }
        return (
          <BreadcrumbItem separator={separator} key={route.breadcrumbName || path}>
            {itemRender(route, params, routes, paths)}
          </BreadcrumbItem>
        );
      });
    } else if (children) {
      crumbs = React.Children.map(children, (element: any, index) => {
        if (!element) {
          return element;
        }
        return cloneElement(element, {
          separator,
          key: index,
        });
      });
    }
    return (
      <div className={classNames(className, prefixCls)} style={style}>
        {crumbs}
      </div>
    );
  }
}
