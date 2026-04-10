import moment from 'moment';
import i18n from 'utils/i18n';
import { getType as getLanguageType } from 'utils/language';
// 日期格式
export const dateFormatStyle = 'YYYY-MM-DD';
// 时间格式
export const timeFormatStyle = 'HH:mm:ss';
// 秒位时间格式
export const timeSecondFormatStyle = 'HH:mm';
// 日期 时间格式
export const dateTimeFormatStyle = `${dateFormatStyle} ${timeFormatStyle}`;
// 日期 秒位时间格式
export const dateSecondsTimeFormatStyle = `${dateFormatStyle} ${timeSecondFormatStyle}`;
// 起始时间
export const dateStartDate = '2000-01-01';
// 货币符号
export const currencyChart = {
  // 美元
  USD: '$',
  // 人民币
  CNY: '¥',
  // 欧元
  EUR: '€',
  // 英镑
  GBP: '￡',
  // 日元
  JPY: '¥'
};
let lang = getLanguageType();
if (lang === 'ar-AE') {
  lang = 'ar-tn';
}
moment.locale(lang);
// 时间范围
export const dateRange = {};
Object.defineProperties(dateRange, {
  all: {
    get: function() {
      return {
        start: moment(dateStartDate).startOf('day'),
        end: moment().endOf('day')
      };
    }
  },
  today: {
    get: function() {
      return {
        start: moment().startOf('day'),
        end: moment().endOf('day')
      };
    }
  },
  yestoday: {
    get: function() {
      return {
        start: moment()
          .subtract(1, 'days')
          .startOf('day'),
        end: moment()
          .subtract(1, 'days')
          .endOf('day')
      };
    }
  },
  last7days: {
    get: function() {
      return {
        start: moment()
          .subtract(6, 'days')
          .startOf('day'),
        end: moment().endOf('day')
      };
    }
  },
  last30days: {
    get: function() {
      return {
        start: moment()
          .subtract(29, 'days')
          .startOf('day'),
        end: moment().endOf('day')
      };
    }
  },
  currentMonth: {
    get: function() {
      return {
        start: moment().startOf('month'),
        end: moment().endOf('month')
      };
    }
  },
  lastMonth: {
    get: function() {
      return {
        start: moment()
          .subtract(1, 'month')
          .startOf('month'),
        end: moment()
          .subtract(1, 'month')
          .endOf('month')
      };
    }
  },
  tomorrow: {
    get: function() {
      return {
        start: moment()
          .add(1, 'days')
          .startOf('day'),
        end: moment()
          .add(1, 'days')
          .endOf('day')
      };
    }
  },
  untilYesterday: {
    //逾期 仅用在客户回访时间
    get: function() {
      return {
        start: moment(dateStartDate).startOf('day'),
        end: moment()
          .subtract(1, 'days')
          .endOf('day')
      };
    }
  },
  untilToday: {
    //今天＋逾期 仅用在客户回访时间
    get: function() {
      return {
        start: moment(dateStartDate).startOf('day'),
        end: moment().endOf('day')
      };
    }
  },
  allrevisitTime: {
    //所有回访日期 仅用在客户回访时间
    get: function() {
      return {
        start: moment(dateStartDate).startOf('day'),
        end: moment('2100-12-31').endOf('day')
      };
    }
  }
});

export const weeks = [
  i18n['general.date_picker.option.weeks.sunday'],
  i18n['general.date_picker.option.weeks.monday'],
  i18n['general.date_picker.option.weeks.tuesday'],
  i18n['general.date_picker.option.weeks.wednesday'],
  i18n['general.date_picker.option.weeks.thursday'],
  i18n['general.date_picker.option.weeks.friday'],
  i18n['general.date_picker.option.weeks.saturday']
];
export const months = [
  i18n['general.date_picker.option.months.january'],
  i18n['general.date_picker.option.months.february'],
  i18n['general.date_picker.option.months.march'],
  i18n['general.date_picker.option.months.april'],
  i18n['general.date_picker.option.months.may'],
  i18n['general.date_picker.option.months.june'],
  i18n['general.date_picker.option.months.july'],
  i18n['general.date_picker.option.months.august'],
  i18n['general.date_picker.option.months.september'],
  i18n['general.date_picker.option.months.october'],
  i18n['general.date_picker.option.months.november'],
  i18n['general.date_picker.option.months.december']
];
export const dayFormat =
  i18n['general.date_picker.option.current_day.dayFormat'];

export const singleDate = {};
Object.defineProperties(singleDate, {
  today: {
    get: function() {
      return moment();
    }
  },
  yestoday: {
    get: function() {
      return moment().subtract(1, 'days');
    }
  }
});

// 允许上传的文件类型
export const fileExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
// 图片类型，因为图片类型可以预览，在可以预览的时候，显示图片
export const imageExtensions = ['jpg', 'jpeg', 'png'];
export const uploadSizeLimit = 5 * 1024 * 1024; //5MB
export const uploadMaxAmount = 10;
export const countryCodeStaticDir =
  '//broker-assets.oss-cn-hangzhou.aliyuncs.com/image/country/';

export const languages = [
  {
    label: i18n['language.bw.chinese.simplified'],
    value: 'zh-CN',
    icon: '86.png',
    code: '+86',
    tag: i18n['language.bw.chinese.simplified.tag']
  },
  {
    label: i18n['language.bw.english'],
    value: 'en-US',
    icon: '44.png',
    code: '+44',
    tag: i18n['language.bw.english.tag']
  },
  // {label: i18n['language.bw.chinese.traditional.hk'], value: 'zh-HK'},
  {
    label: i18n['language.bw.chinese.traditional.tw'],
    value: 'zh-TW',
    icon: '886.png',
    code: '+886',
    tag: i18n['language.bw.chinese.traditional.tw.tag']
  },
  {
    label: i18n['language.bw.japanese'],
    value: 'ja-JP',
    icon: '81.png',
    code: '+81',
    tag: i18n['language.bw.japanese.tag']
  },
  {
    label: i18n['language.bw.korea'],
    value: 'ko-KR',
    icon: '82.png',
    code: '+82',
    tag: i18n['language.bw.korea.tag']
  },
  {
    label: i18n['language.bw.vietnam'],
    value: 'vi-VN',
    icon: '84.png',
    code: '+84',
    tag: i18n['language.bw.vietnam.tag']
  },
  {
    label: i18n['language.bw.thai'],
    value: 'th-TH',
    icon: '66.png',
    code: '+66',
    tag: i18n['language.bw.thai.tag']
  },
  {
    label: i18n['language.bw.indonesian'],
    value: 'id-ID',
    icon: '62.png',
    code: '+62',
    tag: i18n['language.bw.indonesian.tag']
  },
  {
    label: i18n['language.bw.arab'],
    value: 'ar-AE',
    icon: '63.png',
    code: '+63',
    tag: i18n['language.bw.arab.tag']
  },
  {
    label: i18n['language.bw.phi'],
    value: 'fil-PH',
    icon: '971.png',
    code: '+971',
    tag: i18n['language.bw.phi.tag']
  }
];

export const LANGUAGE_CDN_URL = '//broker-static.oss-cn-hangzhou.aliyuncs.com';

export const LANGUAGE_LOCAL_TO_API_KEY = {
  'zh-CN': 'zhCN',
  'zh-TW': 'zhTW',
  'zh-HK': 'zhHK',
  'en-US': 'enUS',
  'ja-JP': 'jaJP',
  'ko-KR': 'koKR',
  'vi-VN': 'viVN',
  'th-TH': 'thTH',
  'id-ID': 'idID',
  'ar-AE': 'arAE',
  'fil-PH': 'filPH'
};
