import cs from './index.less';
import {
  VERIFY_ICON_MAP,
  VERIFY_BUTTON_TEXT_MAP,
  OPTIONS_TO_VERIFY
} from '../../constants';
import Checkbox from 'components/Checkbox';
import i18n from '../../../../utils/i18n';
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
      selectedItemMap
    } = this.props;
    const { name } = verifyData;
    const checked = !!selectedItemMap[key];
    return (
      <div className={cs['select-item']}>
        <Checkbox
          className={cs['checkbox']}
          checked={checked}
          onChange={this.toggle}
        >
          <span className={cs['title']}>{title}</span>
          <div className={cs['content']}>
            {label}: {verifyData[key]}
          </div>
          <div className={cs['content']}>
            {i18n['verification.label.name']}: {verifyData.name}
          </div>
        </Checkbox>
      </div>
    );
  }
}
