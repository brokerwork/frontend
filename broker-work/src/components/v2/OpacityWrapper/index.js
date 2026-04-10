import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import cs from './Opacity.less';

class OpacityWrapperComponent extends PureComponent {
  render() {
    const { children, appear } = this.props;
    const props = appear
      ? {
          transitionAppear: true,
          transitionAppearTimeout: 200,
          transitionEnterTimeout: 200,
          transitionLeaveTimeout: 200
        }
      : {
          transitionEnterTimeout: 200,
          transitionLeaveTimeout: 200
        };
    return (
      <CSSTransitionGroup transitionName="opacity" {...props}>
        {children}
      </CSSTransitionGroup>
    );
  }
}

export const OpacityWrapper = OpacityWrapperComponent;
