import cs from './index.less';
import PageSider from '../Sider';
import PageFooter from 'components/Footer';
import { Layout as LeanLayout } from 'lean-ui';
import { FormattedMessage } from 'react-intl';
import i18n from 'utils/i18n';
import moment from 'moment';
import { getTopRight } from 'commonActions/actions';
import { connect } from 'react-redux';

const { Layout, Sider, Header, Footer, Content } = LeanLayout;

const PageFooterContainer = connect(
  ({ common }) => {
    return {
      brandInfo: common.brandInfo,
      topRights: common.topRights
    };
  },
  { getTopRight }
)(props => {
  return (
    <PageFooter
      brandInfo={props.brandInfo}
      topRights={props.topRights}
      getTopRight={props.getTopRight}
    />
  );
});

export class LayoutContainer extends Component {
  render() {
    const {
      children,
      footer,
      border,
      background,
      isScroll,
      ...otherProps
    } = this.props;
    return (
      <Layout
        {...otherProps}
        className={`${cs['page-layout']} ${border ? cs['border'] : ''} ${
          background ? cs['background'] : ''
        }`}
      >
        {children}
        {footer ? <PageFooterContainer /> : undefined}
      </Layout>
    );
  }
}

const SUMMARY_INFO_MESSAGES = {
  total: 'layout.summary.total',
  orderBy: 'layout.summary.orderBy',
  updateTime: 'layout.summary.updateTime'
};

class LayoutSummaryInfo extends PureComponent {
  getShownMessages = props => {
    const arr = [];
    for (let i in SUMMARY_INFO_MESSAGES) {
      if (i in props) {
        let value = '';
        if (i === 'total') {
          value = props[i];
          value = typeof value === 'number' ? `${value}` : value;
        } else {
          value = props[i] || '';
        }
        if (value && i === 'updateTime') {
          value = moment(value).format('YYYY-MM-DD HH:mm');
        }
        const messageKey = SUMMARY_INFO_MESSAGES[i];
        const content = (
          <FormattedMessage
            id={messageKey}
            defaultMessage={i18n[messageKey] || '{value}'}
            values={{
              value
            }}
          />
        );
        arr.push(content);
      }
    }
    return arr;
  };
  render() {
    const { className, children, moduleName } = this.props;
    const messages = this.getShownMessages(this.props);
    return (
      <div className={`${cs['summarize']} ${cs['className']}`}>
        {moduleName ? `${moduleName} · ` : undefined}
        {messages.map((message, i) => {
          return (
            <span key={i}>
              {i ? ' · ' : ''}
              {message}
            </span>
          );
        })}
        {children}
      </div>
    );
  }
}

export class LayoutSummary extends Component {
  render() {
    const { children, border = true } = this.props;
    return (
      <Layout
        className={`${cs['layout-summary']} ${cs['page-layout']} ${
          border ? cs['border'] : ''
        }`}
      >
        {children}
      </Layout>
    );
  }
}

LayoutSummary.Info = LayoutSummaryInfo;

export class LayoutSider extends Component {
  render() {
    const { children, collapsable, ...otherProps } = this.props;
    const RealSider = collapsable ? Sider : PageSider;
    return (
      <div className={cs['layout-sider']}>
        <RealSider {...otherProps}>{children}</RealSider>
      </div>
    );
  }
}

export class LayoutContent extends PureComponent {
  render() {
    const { children, old, className, scrollable = true, table } = this.props;
    const _scrollable = table ? 'x' : scrollable;
    const tableClassName = table ? cs['table'] : '';
    const oldClassName = old ? cs['old'] : '';
    const scrollClassName = cs[`scrollable-${_scrollable}`];
    return (
      <Content
        className={`${cs['layout-content']} ${className ? className : ''} ${
          oldClassName ? oldClassName : ''
        } ${scrollClassName ? scrollClassName : ''} ${
          tableClassName ? tableClassName : ''
        }`}
      >
        {children}
      </Content>
    );
  }
}

export const LayoutHeader = Header;
export const LayoutFooter = Footer;
