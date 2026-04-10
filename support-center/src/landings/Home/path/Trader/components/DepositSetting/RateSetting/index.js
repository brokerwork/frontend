import DepositForm from './form';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import cs from './index.less';
import { DEPOSIT_SETTING_FORM } from './form';

import _ from 'lodash';
export default class RateSetting extends PureComponent {
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(DEPOSIT_SETTING_FORM);
  };
  onReset = () => {
    this.props.reset(DEPOSIT_SETTING_FORM);
    this.props.showTopAlert({
      style: 'success',
      content: i18n['general.reset_success']
    });
  };
  render() {
    return (
      <div>
        <DepositForm {...this.props} />
        <div className={cs.footer_button}>
          <Button style="primary" onClick={this.onSave}>
            {i18n['app.btn.save']}
          </Button>
          <Button onClick={this.onReset}> {i18n['app.btn.reset']}</Button>
        </div>
      </div>
    );
  }
}
