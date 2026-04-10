import moment from 'moment';
import i18n from 'utils/i18n';
import { dateFormatStyle } from 'utils/config';

export const todayKey = i18n['general.date_range_picker.option.today'];
export default data => {
  const today = moment();
  const yestoday = today.clone().subtract('1', 'days');
  const yestodayKey = i18n['general.date_range_picker.option.yestoday'];
  const __obj = {};

  data.forEach((item, index) => {
    let key = moment(item.time);

    if (key.isSame(today, 'day')) {
      key = todayKey;
    } else if (key.isSame(yestoday, 'day')) {
      key = yestodayKey;
    } else {
      key = key.format(dateFormatStyle);
    }

    if (!__obj[key]) __obj[key] = [];
    __obj[key].push(item);
  });

  return __obj;
};
