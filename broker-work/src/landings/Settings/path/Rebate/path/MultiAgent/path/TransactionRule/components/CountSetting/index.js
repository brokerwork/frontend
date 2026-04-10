import i18n from 'utils/i18n';
import { Dialog, Button, InputNumber } from 'lean-ui';
import { FormattedMessage } from 'react-intl';

import cs from './CountSetting.less';

export default class CountSetting extends PureComponent {
  state = {
    minSeconds: this.props.data
  };
  changeValue = v => {
    this.setState({
      minSeconds: v
    });
  };

  onSave = () => {
    const { minSeconds } = this.state;
    const { onSave } = this.props;
    onSave(minSeconds || 0);
  };

  render() {
    const { onHide } = this.props;
    const { minSeconds } = this.state;
    return (
      <Dialog
        title={i18n['settings.rebate_setting.count_setting_title']}
        visible={true}
        onCancel={onHide}
        footer={
          <div>
            <Button onClick={onHide}>{i18n['general.cancel']}</Button>
            <Button type="primary" onClick={this.onSave}>
              {i18n['general.confirm']}
            </Button>
          </div>
        }
      >
        <div className={cs['warning-tips']}>
          {i18n['settings.rebate_setting.count_setting_warning']}
        </div>
        <div className={cs['count-setting-input']}>
          <FormattedMessage
            id="settings.rebate_setting.count_setting"
            defaultMessage={i18n['settings.rebate_setting.count_setting']}
            values={{
              input: (
                <InputNumber
                  step={1}
                  min={0}
                  precision={0}
                  max={1800}
                  value={minSeconds}
                  placeholder="0~1800"
                  onChange={this.changeValue}
                />
              )
            }}
          />
        </div>
      </Dialog>
    );
  }
}
