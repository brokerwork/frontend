import cs from './index.less';
import { VERIFY_ICON_MAP, VERIFY_BUTTON_TEXT_MAP } from '../../constants';

export default class Button extends PureComponent {
  render() {
    const { verifyState, buttonClassName } = this.props;
    const stateClassName = `${verifyState && verifyState.toLowerCase()}`;
    return (
      <span
        className={`${cs['verify-button']} ${cs[
          stateClassName
        ]} ${buttonClassName}`}
      >
        <i>
          <b className={`fa fa-${VERIFY_ICON_MAP[verifyState]}`} />
        </i>
        <span>{VERIFY_BUTTON_TEXT_MAP[verifyState]}</span>
      </span>
    );
  }
}
