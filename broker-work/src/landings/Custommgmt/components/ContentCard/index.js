import cs from './ContentCard.less';
import PropTypes from 'prop-types';
import i18n from 'utils/i18n';
import { Icon as LIcon } from 'lean-ui';

class ContentCard extends PureComponent {
  state = {
    hidding: this.props.hidding || !!this.props.limit, //直接传如hidding 或者传入limit来判断
    listNum: 0 //hidding模式时无作用
  };
  getChildContext() {
    return {
      limit: this.props.limit,
      hidding: this.state.hidding,
      registListNum: this.registListNum
    };
  }
  registListNum = listNum => {
    this.setState({
      listNum
    });
  };
  toggleLimit = () => {
    const { hidding } = this.state;
    const { onToggle } = this.props;
    if (onToggle) {
      onToggle();
    }
    this.setState({
      hidding: !hidding
    });
  };
  componentWillReceiveProps(nextProps) {
    const { hidding } = this.state;
    const { hidding: nextHidding } = nextProps;
    if (nextHidding !== hidding) {
      this.setState({
        hidding: nextHidding
      });
    }
  }
  render() {
    const { children, className, limit, onToggle, footer } = this.props;
    const { hidding, listNum } = this.state;
    // const str = hidding
    //   ? i18n['content.card.toggle_text.more']
    //   : i18n['content.card.toggle_text.less'];
    const str =
      hidding || this.props.hidding
        ? i18n['customer.conent_card.show_more']
        : i18n['customer.conent_card.hide_more'];
    const iconClass =
      hidding || this.props.hidding ? 'fa fa-angle-down' : 'fa fa-angle-up';
    return (
      <div className={`${cs['root']} ${className ? className : ''} `}>
        {children}
        {(limit && limit < listNum) || onToggle ? (
          <Footer>
            <div
              onClick={this.toggleLimit}
              className={`${cs['toggle-click']} main-color ${
                className ? className : ''
              }`}
            >
              <i className={iconClass} /> <span>{str}</span>
            </div>
          </Footer>
        ) : (
          undefined
        )}
        {footer}
      </div>
    );
  }
}

function Icon({
  children,
  className,
  icon,
  primary,
  iconWrap,
  iconClassName,
  oldIcon
}) {
  return (
    <div
      className={`${cs['icon']} ${className ? className : ''} ${
        primary ? `${cs['primary']} main-color` : ''
      } ${iconWrap ? `${cs['iconWrap']} main-color-bg` : ''} `}
    >
      {icon ? (
        oldIcon ? (
          <span className={`${icon}`} />
        ) : (
          <LIcon fontType="bw" icon={icon} className={iconClassName} />
        )
      ) : (
        children
      )}
    </div>
  );
}

function Title({ children, className }) {
  return (
    <div className={`${cs['title']} ${className ? className : ''}`}>
      {children}
    </div>
  );
}

function Tools({ children, className }) {
  return (
    <div className={`${cs['tools']} ${className ? className : ''}`}>
      {children}
    </div>
  );
}

function Header({
  children,
  className,
  icon,
  title,
  border,
  primary,
  iconClassName,
  iconWrap
}) {
  return (
    <div
      className={`${cs['header']} ${className ? className : ''} ${
        border ? cs['border'] : ''
      }`}
    >
      {icon ? (
        <Icon
          primary={primary}
          icon={icon}
          iconClassName={iconClassName}
          iconWrap={iconWrap}
        />
      ) : (
        undefined
      )}
      {title ? <Title>{title}</Title> : undefined}
      {children}
    </div>
  );
}

class Body extends PureComponent {
  state = {
    hidding: this.context && this.context.hidding
  };
  componentDidMount() {
    const { registListNum, hidding } = this.context;
    const { children } = this.props;
    if (Array.isArray(children)) {
      registListNum(children.length);
    }
    this.setState({
      hidding
    });
  }
  componentWillReceiveProps(nextProps, nextContext) {
    const { registListNum } = this.context;
    const { children } = this.props;
    const { children: nextChildren } = nextProps;
    const { hidding } = this.context;
    const { hidding: nextHidding } = nextContext;

    if (
      Array.isArray(nextChildren) &&
      children.length !== nextChildren.length
    ) {
      registListNum(nextChildren.length);
    }
    if (hidding !== nextHidding) {
      this.setState({
        hidding: nextHidding
      });
    }
  }
  renderLimitedChildren = () => {
    const { children } = this.props;
    const { limit } = this.context;
    const isArray = Array.isArray(children);
    return isArray ? children.filter((item, i) => i < limit) : children;
  };
  render() {
    const { children, className } = this.props;
    const { limit } = this.context;
    const { hidding } = this.state;
    return (
      <div className={`${cs['body']} ${className ? className : ''}`}>
        {limit && hidding ? this.renderLimitedChildren() : children}
      </div>
    );
  }
}

Body.contextTypes = {
  limit: PropTypes.number,
  hidding: PropTypes.bool,
  registListNum: PropTypes.func
};

function Footer({ children, className, border, dark, min }) {
  return (
    <div
      className={`${cs['footer']} ${className ? className : ''} ${
        border ? cs['border'] : ''
      } ${dark ? cs['dark'] : ''} ${min ? cs['min'] : ''} `}
    >
      {children}
    </div>
  );
}

function Buttons({ children, className, icon, title, right }) {
  return (
    <div
      className={`${cs['buttons']} ${className ? className : ''} ${
        right ? cs['right'] : ''
      } `}
    >
      {children}
    </div>
  );
}

ContentCard.Icon = Icon;
ContentCard.Title = Title;
ContentCard.Tools = Tools;
ContentCard.Header = Header;
ContentCard.Body = Body;
ContentCard.Buttons = Buttons;
ContentCard.Footer = Footer;
ContentCard.childContextTypes = {
  limit: PropTypes.number,
  hidding: PropTypes.bool,
  registListNum: PropTypes.func
};
export default ContentCard;
