import * as React from 'react';
// import enUS from 'rc-pagination/lib/locale/en_US';
import RcPagination from './rc';
import * as classNames from 'classnames';
// import LocaleReceiver from '../locale-provider/LocaleReceiver';
import Select from './DefaultSelect';
// import MiniSelect from './MiniSelect';
import * as PropTypes from 'prop-types';

const LOCALE = {
  // Options.jsx
  items_per_page: '条/每页记录数',
  custom_per_page: '自定义每页记录数',
  custom_page_max: '最大{maxSize}条',
  jump_to: '跳至',
  page: '页',
  prev_page: '上一页',
  next_page: '下一页'
};

const HACK_LOCALE = {
  ...LOCALE,

  // Pagination.jsx
  prev_page: '上一页',
  next_page: '下一页',
  prev_5: '向前 5 页',
  next_5: '向后 5 页',
  prev_3: '向前 3 页',
  next_3: '向后 3 页'
};

const prefixCls = 'lean-pagination';
const selectPrefixCls = 'lean-select';

export interface PaginationProps {
  total?: number;
  defaultCurrent?: number;
  current?: number;
  defaultPageSize?: number;
  pageSize?: number;
  onChange?: (page: number, pageSize?: number) => void;
  hideOnSinglePage?: boolean;
  showSizeChanger?: boolean;
  pageSizeOptions?: string[];
  onShowSizeChange?: (current: number, size: number) => void;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;
  size?: string;
  // simple?: boolean;
  style?: React.CSSProperties;
  locale?: any;
  className?: string;
  // itemRender?: (
  //   page: number,
  //   type: "page" | "prev" | "next" | "jump-prev" | "jump-next"
  // ) => React.ReactNode;
  looseStyle?: boolean;
  iconJumper?: boolean;
  align?: string;
}

export type PaginationLocale = any;

export default class Pagination extends React.Component<PaginationProps, {}> {
  static defaultProps = {
    total: 0,
    defaultCurrent: 1,
    defaultPageSize: 10,
    pageSize: 10,
    hideOnSinglePage: false,
    showSizeChanger: false,
    pageSizeOptions: ['10', '20', '30', '40'],
    showQuickJumper: false,
    looseStyle: false,
    iconJumper: false,
    locale: LOCALE,
    align: 'right'
  };

  static propTypes = {
    total: PropTypes.number,
    defaultCurrent: PropTypes.number,
    current: PropTypes.number,
    defaultPageSize: PropTypes.number,
    pageSize: PropTypes.number,
    onChange: PropTypes.func,
    hideOnSinglePage: PropTypes.bool,
    showSizeChanger: PropTypes.bool,
    pageSizeOptions: PropTypes.array,
    onShowSizeChange: PropTypes.func,
    showQuickJumper: PropTypes.bool,
    showTotal: PropTypes.func,
    size: PropTypes.string,
    // simple: PropTypes.bool,
    style: PropTypes.object,
    locale: PropTypes.object,
    className: PropTypes.string,
    // itemRender: PropTypes.func,
    looseStyle: PropTypes.bool,
    iconJumper: PropTypes.bool,
    align: PropTypes.string
  };

  //   renderPagination = (locale: PaginationLocale) => {
  //     const { className, size, ...restProps } = this.props;
  //     const isSmall = size === 'small';
  //     return (
  //       <RcPagination
  //         {...restProps}
  //         className={classNames(className, { mini: isSmall })}
  //         // selectComponentClass={isSmall ? MiniSelect : Select}
  //         locale={locale}
  //       />
  //     );
  //   }

  itemRender = (
    page: number,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
    originalElement: React.ReactNode
  ) => {
    const { locale, iconJumper } = this.props;
    if (!iconJumper) {
      if (type === 'prev') {
        return (
          <a className={`${prefixCls}-item-link ${prefixCls}-item-link-text`}>
            {locale.prev_page}
          </a>
        );
      } else if (type === 'next') {
        return (
          <a className={`${prefixCls}-item-link ${prefixCls}-item-link-text`}>
            {locale.next_page}
          </a>
        );
      }
    }

    return originalElement;
  };
  render() {
    const {
      className,
      size,
      looseStyle,
      locale,
      align,
      ...restProps
    } = this.props;
    const isSmall = size === 'small';
    return (
      <RcPagination
        prefixCls={prefixCls}
        selectPrefixCls={selectPrefixCls}
        {...restProps}
        className={classNames(
          className,
          { compact: !looseStyle },
          { mini: isSmall },
          { right: align === 'right' }
        )}
        locale={{ ...HACK_LOCALE, ...locale }}
        itemRender={this.itemRender}
        selectComponentClass={Select}
      />
    );
  }
}

