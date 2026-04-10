import cs from './index.less';
import {
  VERIFY_ICON_MAP,
  VERIFY_BUTTON_TEXT_MAP,
  OPTIONS_TO_VERIFY,
  showFieldMap
} from '../../constants';
import { Checkbox } from 'lean-ui';
import i18n from 'utils/i18n';
import { getCountry } from 'utils/country';
export default class SelectItem extends PureComponent {
  toggle = () => {
    const {
      option,
      option: { key },
      verifyData,
      selectedItemMap,
      onItemSelect
    } = this.props;
    const checked = selectedItemMap[key];
    if (onItemSelect) {
      onItemSelect(key, checked ? false : option);
    }
  };
  render() {
    const {
      option: { key, label, title },
      verifyData,
      selectedItemMap,
      fields: { t_account_profiles, baseInfo }
    } = this.props;
    const { name } = verifyData;
    const checked = !!selectedItemMap[key];
    console.log('verifyData', verifyData);
    return (
      <div className={cs['select-item']}>
        <Checkbox
          className={cs['checkbox']}
          checked={checked}
          onChange={this.toggle}
        >
          <span className={cs['title']}>{title}</span>
          {!showFieldMap[key] && (
            <div className={cs['content']}>
              {label}: {verifyData[key]}
            </div>
          )}
          {!showFieldMap[key] && (
            <div className={cs['content']}>
              {i18n['verification.label.name']}: {verifyData.name}
            </div>
          )}
          {showFieldMap[key] &&
            showFieldMap[key].map(el => {
              const field = (t_account_profiles || baseInfo).find(
                field => field.key === el
              );
              let label = verifyData[el];
              if (el === 'countryGbg') {
                const country = getCountry(true);
                label = country.find(c => c.value === label).label;
              }
              return (
                <div className={cs['content']}>
                  {field && field.label}: {label}
                </div>
              );
            })}
        </Checkbox>
      </div>
    );
  }
}
