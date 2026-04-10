import { Button, Dialog, Radio, Popover, Icon } from 'lean-ui';
import i18n from 'utils/i18n';
import cs from './index.less';
import { FormattedMessage } from 'react-intl';

import { AdjustCycleOption } from '../../constant';
const RadioGroup = Radio.Group;
export default class CycleSettingModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      period: props.ruleDetail.adjustPeriod || 'NONE',
      visible: {
        NONE: false,
        DAY: false,
        MONTH: false
      }
    };
  }
  componentWillReceiveProps(nextprops) {
    this.setState({
      period: nextprops.ruleDetail.adjustPeriod || 'NONE'
    });
  }
  onSave = () => {
    // const { showTipsModal } = this.props;
    // const { period } = this.state;
    // if (period === 'NONE') {
    //   showTipsModal({
    //     content: i18n['settings.rebate_setting.params_setting.cycle_none_tips'],
    //     onConfirm: cb => {
    //       this.onSubmit(cb);
    //     }
    //   });
    // } else {
    //   this.onSubmit();
    // }
    this.onSubmit();
  };
  onSubmit = cb => {
    const {
      adjustPeriod,
      ruleDetail,
      onHide,
      getRuleDetail,
      showTipsModal,
      realTimeStatus
    } = this.props;
    const { period } = this.state;
    const params = { period, ruleId: ruleDetail.id };
    if ((period === 'DAY' || period === 'MONTH') && realTimeStatus.status) {
      showTipsModal({
        title: i18n['settings.rebate_setting.params_setting.auto_just.tip'],
        content: (
          <div>
            <p>
              {i18n['settings.rebate_setting.params_setting.auto_just.tip']}
            </p>
            <p>
              {i18n['settings.rebate_setting.params_setting.auto_just.tip.ps']}
            </p>
          </div>
        ),
        onConfirm: cb => {
          adjustPeriod(params).then(res => {
            if (res.result) {
              this.onHide();
              getRuleDetail(ruleDetail.id);
              cb && cb();
            }
          });
          cb();
        }
      });
    } else {
      adjustPeriod(params).then(res => {
        if (res.result) {
          onHide();
          getRuleDetail(ruleDetail.id);
          cb && cb();
        }
      });
    }
  };
  onHide = () => {
    const visible = {
      NONE: false,
      DAY: false,
      MONTH: false
    };
    this.setState({
      visible
    });
    this.props.onHide();
  };
  onChange = val => {
    const visible = {
      NONE: false,
      DAY: false,
      MONTH: false
    };
    // if (val === 'NONE') {
    //   this.setState({
    //     period: val
    //   });
    // } else {
    //   visible[val] = true;
    // }
    visible[val] = true;
    this.setState({
      visible
    });
  };
  hideNotice = val => {
    const visible = {
      NONE: false,
      DAY: false,
      MONTH: false
    };
    this.setState({
      visible
    });
  };
  onConfirm = val => {
    this.setState({
      period: val
    });
    this.hideNotice(val);
  };
  render() {
    const { show } = this.props;
    const { period, visible } = this.state;
    // 是否可提交，当切换返佣类型时，若提示框没有关闭，不允许提交
    const canSubmit = Object.keys(visible).some(key => visible[key])
      ? true
      : false;
    return (
      <Dialog
        title={i18n['settings.rebate_setting.params_setting.cycle_setting']}
        visible={show}
        className={cs.cycle_setting_modal}
        onCancel={this.onHide}
        footer={
          <div>
            <Button onClick={this.onHide}>{i18n['general.cancel']}</Button>
            <Button type="primary" onClick={this.onSave} disabled={canSubmit}>
              {i18n['general.confirm']}
            </Button>
          </div>
        }
      >
        <div className={cs.cycle_adjust_radio}>
          <RadioGroup name="period" value={period} onChange={this.onChange}>
            {AdjustCycleOption.map(item => (
              <Popover
                content={
                  <div>
                    <div className={cs.notice_title}>
                      <Icon className={cs.icon} icon="info" />
                      {item.value === 'NONE' ? (
                        i18n[
                          'settings.rebate_setting.params_setting.cycle_none_tips'
                        ]
                      ) : (
                        <FormattedMessage
                          id="settings.rebate_setting.params_setting.cycle_setting.notice"
                          defaultMessage={
                            i18n[
                              'settings.rebate_setting.params_setting.cycle_setting.notice'
                            ]
                          }
                          values={{
                            type:
                              i18n[
                                `settings.rebate_setting.params_setting.cycle_setting.notice.${
                                  item.value
                                }`
                              ]
                          }}
                        />
                      )}
                    </div>
                    <div className={cs.notice_footer}>
                      <Button
                        size="small"
                        onClick={this.hideNotice.bind(this, item.value)}
                      >
                        {i18n['general.cancel']}
                      </Button>
                      <Button
                        size="small"
                        type="primary"
                        onClick={this.onConfirm.bind(this, item.value)}
                      >
                        {i18n['general.confirm']}
                      </Button>
                    </div>
                  </div>
                }
                trigger="click"
                placement="bottom"
                visible={visible[item.value]}
              >
                <Radio key={item.value} value={item.value}>
                  {i18n[`${item.label}`]}
                </Radio>
              </Popover>
            ))}
          </RadioGroup>
        </div>
        <div className={cs.explain}>
          {i18n['settings.rebate_setting.params_setting.cycle_setting.explain']
            .split('</br>')
            .map(item => (
              <p>{item}</p>
            ))}
        </div>
      </Dialog>
    );
  }
}
