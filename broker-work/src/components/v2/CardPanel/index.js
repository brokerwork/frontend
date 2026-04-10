import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import cs from './CardPanel.less';

export default class CardPanel extends PureComponent {
  state = {
    renderChildren: false
  };

  componentDidMount() {
    const { show } = this.props;

    setTimeout(() => {
      this.setState({
        renderChildren: show
      });
    }, 550);
  }

  closePanel = () => {
    const { onClose } = this.props;
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  render() {
    const { title, children, className, show, style = {} } = this.props;
    const { renderChildren } = this.state;
    let classStr = '';
    if (className) classStr += ` ${className}`;

    return (
      <div>
        <div
          key={title}
          style={style}
          className={`panel panel-default ${cs['card-panel']} ${classStr}`}
        >
          <div className={`panel-heading ${cs['panel-heading']}`}>
            <div className={`panel-title ${cs['panel-title']}`}>
              {title}
              <button
                type="button"
                className={`close ${cs['close']}`}
                onClick={this.closePanel}
              >
                <span className="fa fa-times" />
              </button>
            </div>
          </div>
          <div className={`panel-body ${cs['panel-body']}`}>
            {renderChildren && children}
          </div>
        </div>
        <div
          onClick={this.closePanel}
          className={`${cs['card-panel-mask']} ${show ? cs['open'] : ''}`}
        />
      </div>
    );
  }
}

CardPanel.Footer = ({ children, className }) => (
  <div className={cs['panel-footer-box']}>
    <div className={`${cs['panel-footer']} ${className}`}>{children}</div>
  </div>
);

class CardPanelWrapperComponent extends PureComponent {
  render() {
    const { children, appear } = this.props;
    const props = appear
      ? {
          transitionAppear: true,
          transitionAppearTimeout: 500,
          transitionEnterTimeout: 500,
          transitionLeaveTimeout: 500
        }
      : {
          transitionEnterTimeout: 500,
          transitionLeaveTimeout: 500
        };

    return (
      <CSSTransitionGroup transitionName="card-panel" {...props}>
        {children}
      </CSSTransitionGroup>
    );
  }
}

export const CardPanelWrapper = CardPanelWrapperComponent;
