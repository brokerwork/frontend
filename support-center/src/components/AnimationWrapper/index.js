import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import cs from './index.less';

export default class AnimationWrapper extends PureComponent {
  render() {
    const { children, appear = true } = this.props;
    const props = appear ? {
      transitionAppear: true,
      transitionAppearTimeout: 500,
      transitionEnterTimeout: 500,
      transitionLeaveTimeout: 500
    } : {
      transitionEnterTimeout: 500,
      transitionLeaveTimeout: 500
    };

    return (
      <CSSTransitionGroup
        transitionName="animation"
        {...props}>
        {children}
      </CSSTransitionGroup>
    );
  }
}