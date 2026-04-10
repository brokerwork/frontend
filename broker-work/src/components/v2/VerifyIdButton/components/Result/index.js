import cs from './index.less';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import {
  VERIFY_ICON_MAP,
  VERIFY_BUTTON_TEXT_MAP,
  OPTIONS_TO_VERIFY
} from '../../constants';

export default class Result extends PureComponent {
  render() {
    const { option, result, verifyData, isDuplicate } = this.props;
    const { name } = verifyData;
    const { checkState, checkResult } = result;
    const iconClassName = checkState ? 'check-circle' : 'times-circle';
    const resultContent = checkState ? (
      <FormattedMessage
        id="verification.check_successed_tip"
        defaultMessage={i18n['verification.check_successed_tip']}
        values={{ type: option.label }}
      />
    ) : (
      i18n.mcode(checkResult)
    );
    return (
      <div className={cs['result-item']}>
        <div
          className={`${isDuplicate ? cs['duplicate'] : ''} ${
            checkState ? cs['successed'] : cs['failed']
          }`}
        >
          <i className={`${cs['icon']} fa fa-${iconClassName}`} />
          <span className={cs['text']}>{resultContent}</span>
          {!checkState && isDuplicate ? (
            <span className={cs['error']}>
              {i18n['verification.tips.need_modify']}
            </span>
          ) : (
            undefined
          )}
        </div>
      </div>
    );
  }
}
