import Radio from 'components/Radio';
import Tips from 'components/Tips';
import i18n from 'utils/i18n';
import cs from './DistributionRuleSetting.less';

export default class ModeSelect extends PureComponent {
  render() {
    const { value, onChange } = this.props;
    return (
      <div className={cs['modeSelectContainer']}>
        <span className={cs['modeSelectTitle']}>{`${i18n[
          'settings.rebate_setting.distribution.modeSelect'
        ]}:`}</span>
        <Radio checked={value === 2} onChange={onChange.bind(this, 2)}>
          {i18n['settings.rebate_setting.distribution.mode1']}
        </Radio>
        <Radio checked={value === 4} onChange={onChange.bind(this, 4)}>
          {i18n['settings.rebate_setting.distribution.mode2']}
        </Radio>
        <Tips className={cs['tips']}>
          <div>{i18n['settings.rebate_setting.distribution.modeTipsP1']}</div>
          <div>{i18n['settings.rebate_setting.distribution.modeTipsP2']}</div>
          <div>{i18n['settings.rebate_setting.distribution.modeTipsP3']}</div>
        </Tips>
      </div>
    );
  }
}
