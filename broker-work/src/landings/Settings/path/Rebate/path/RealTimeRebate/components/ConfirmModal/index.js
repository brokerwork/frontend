import i18n from 'utils/i18n';
import cs from './ConfirmModal.less';
import { Message, Button, Dialog, Radio } from 'lean-ui';
const proRightKey = 'SYSTEM_REBATE_AUTO-ADJUST';

export default class OpenRealTimeConfirmModal extends PureComponent {
  state = {
    type: 0
  };

  changeRT = type => {
    this.setState({
      type
    });
  };
  // 列表是否有设置过自动调整返佣参数
  canISet = () => {
    const { ruleList, userRights } = this.props;
    return (
      ruleList &&
      ruleList.length &&
      ruleList.some(
        item => item.adjustPeriod === 'MONTH' || item.adjustPeriod === 'DAY'
      ) &&
      userRights[proRightKey]
    );
  };
  onSave = () => {
    const { type } = this.state;
    const {
      enableRealTime,
      disableRealTime,
      realTimeStatus,
      onHide,
      functionType,
      showTipsModal
    } = this.props;
    const action =
      realTimeStatus.status === 0 ? enableRealTime : disableRealTime;
    const status = realTimeStatus.status === 0 ? 1 : 0;
    if (type === 1 && this.canISet()) {
      showTipsModal({
        title:
          i18n['settings.rebate_setting.params_setting.auto_just.tip.title'],
        content: i18n['setting.rebate_setting.start_rcr_tips'],
        onConfirm: cb => {
          onHide();
          cb();
        }
      });
    } else {
      action({ type, status, functionType }).then(({ result }) => {
        if (result) {
          Message.success(
            realTimeStatus.status === 0
              ? type === 0
                ? i18n['settings.rebate_setting.enable_auto_rebate.tips']
                : i18n['settings.rebate_setting.enable_auto_rt.tips']
              : type === 0
                ? i18n['settings.rebate_setting.disable_auto_rebate.tips']
                : i18n['settings.rebate_setting.disable_auto_rt.tips']
          );
          onHide();
        }
      });
    }
  };

  render() {
    const { show, onHide, realTimeStatus, brandInfo } = this.props;
    console.log(this.props, 'debg');
    const { type } = this.state;
    // 如果当前版本为basic，并且开通时间在2020年3月1日之后，则实时返佣按钮disabled
    const isDisabled =
      brandInfo.topVersionId === 'TV001' &&
      brandInfo.started > new Date('2020/03/01').getTime();
    return (
      <Dialog
        title={i18n['settings.rebate_setting.enable_auto_rebate.title_tips']}
        visible={true}
        className={cs['pvmap-modal']}
        onCancel={onHide}
        footer={
          <div>
            <Button type="primary" onClick={this.onSave}>
              {i18n['general.confirm']}
            </Button>
            <Button onClick={onHide}>{i18n['general.cancel']}</Button>
          </div>
        }
      >
        {realTimeStatus.status === 0 ? ( //判断返佣状态，0为已禁用
          realTimeStatus.rcrEnable ? ( //是否是实时返佣版本
            <div>
              <div className={cs['grid-control']}>
                <Radio
                  onChange={this.changeRT.bind(this, 0)}
                  className={cs['radio']}
                  checked={type === 0} // 按天返佣
                >
                  {i18n['settings.rebate_setting.real_time_title']}
                </Radio>
                <Radio
                  onChange={this.changeRT.bind(this, 1)}
                  className={cs['radio']}
                  checked={type === 1} // 实时返佣
                  disabled={isDisabled}
                >
                  {i18n['settings.rebate_setting.real_time_commission_title']}
                </Radio>
              </div>
              <div className={cs['grid-control']}>
                {type === 0 ? (
                  <p>
                    {
                      i18n[
                        'settings.rebate_setting.enable_auto_rebate.confirm_tips'
                      ]
                    }
                  </p>
                ) : (
                  <div>
                    <p>
                      {
                        i18n[
                          'settings.rebate_setting.enable_auto_rebate.rt_confirm_tips'
                        ]
                      }
                    </p>
                    <p>
                      {
                        i18n[
                          'settings.rebate_setting.enable_auto_rebate.rt_confirm_tips_mt5'
                        ]
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={cs['text']}>
              <p>
                {i18n['settings.rebate_setting.enable_auto_rebate.confirm']}
              </p>
              <p>
                {
                  i18n[
                    'settings.rebate_setting.enable_auto_rebate.confirm_tips'
                  ]
                }
              </p>
            </div>
          )
        ) : (
          <div className={cs['text']}>
            {realTimeStatus.type === 0
              ? i18n['settings.rebate_setting.disable_auto_rebate.confirm']
              : i18n['settings.rebate_setting.disable_auto_rt.confirm']}
          </div>
        )}
      </Dialog>
    );
  }
}
