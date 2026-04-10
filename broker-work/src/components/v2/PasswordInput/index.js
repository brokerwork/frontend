import { Input, Icon } from 'lean-ui';
import cs from './index.less';
export default class PassowrdInput extends Component {
  state = {
    showPassword: false
  };
  toggleIcon = () => {
    const { showPassword } = this.state;
    this.setState({
      showPassword: !showPassword
    });
  };
  render() {
    const { showPassword } = this.state;
    const { inputClassName, className } = this.props;
    const formControlProps = { ...this.props, className: inputClassName };
    return (
      <span className={`${cs['password-field']} ${className}`}>
        <Input
          {...formControlProps}
          type={showPassword ? 'text' : 'password'}
        />
        <span className={cs['eye-icon']} onClick={this.toggleIcon}>
          <Icon
            className={cs['icon']}
            fontType="bw"
            icon={showPassword ? 'lw-eye-open-outline' : 'eye-close-outline'}
          />
        </span>
      </span>
    );
  }
}
