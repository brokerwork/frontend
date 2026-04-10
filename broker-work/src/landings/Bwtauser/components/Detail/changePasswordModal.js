import i18n from 'utils/i18n';
import cs from './index.less';
import { Dialog, Input } from 'lean-ui';
import PasswordInput from 'components/v2/PasswordInput';

class ChangePasswordModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: '',
      error: false
    };
  }
  onSave = () => {
    const { newPassword } = this.state;
    const { onSave } = this.props;
    if (!newPassword) {
      this.setState({
        error: true
      });
      return;
    } else {
      this.setState({
        error: false
      });
      onSave(newPassword);
    }
  };
  setPassword = e => {
    const v = e.target.value;
    this.setState({
      newPassword: v,
      error: false
    });
  };
  render() {
    const { onHide } = this.props;
    const { newPassword, error } = this.state;
    return (
      <Dialog
        title={i18n['tausermgmt.detail.panel_reset_password']}
        onOk={this.onSave}
        onCancel={onHide}
        visible={true}
        cancelText={i18n['general.cancel']}
        okText={i18n['general.save']}
      >
        <div className="form-horizontal">
          <div className="form-group">
            <label className={`col-sm-4 control-label required ${cs['label']}`}>
              {i18n['tausermgmt.detail.panel_new_password']} :{' '}
            </label>
            <div className="col-sm-5">
              <PasswordInput
                id="changePasswordInput"
                value={newPassword}
                onChange={this.setPassword}
                className={`${error ? cs['error'] : ''}`}
              />
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default ChangePasswordModal;
