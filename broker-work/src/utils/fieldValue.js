import { getCountry, getCountryObject } from 'utils/country';
import moment from 'moment';
import { dateFormatStyle } from 'utils/config';
import { imageExtensions } from 'utils/config';
import cls from 'utils/class';
import Image from 'components/Image';
import i18n from 'utils/i18n';
import { getCountryCode } from 'utils/phoneCountryCode';

let countryData = getCountryObject();

const getCountryLabel = code => {
  return countryData[code] || '';
};

const getFieldValue = (field, value) => {
  if (!countryData) countryData = getCountryObject();
  switch (field.fieldType) {
    case 'city':
      return value
        ? cls`${getCountryLabel(value.country)}
                    ${getCountryLabel(value.province)}
                    ${getCountryLabel(value.city)}`
        : '';
      break;

    case 'phone':
      return value
        ? `${value.countryCode ? `${value.countryCode}` : ''} ${value.phone ||
            ''}`
        : '';
      break;

    case 'checkbox':
      return value
        ? value
            .map(
              _v =>
                (field.optionList.find(option => option.value == _v) || {})
                  .label
            )
            .join('，')
        : '';
      break;

    case 'radio':
      return value
        ? (field.optionList.find(option => option.value == value) || {}).label
        : '';
      break;

    case 'select':
      return value
        ? (field.optionList.find(option => option.value == value) || {})
            .label || value
        : '';
      break;

    case 'image':
      return value ? getImageValue(value) : '';
      break;

    case 'country':
      return value ? getCountryLabel(value) : '';
      break;

    case 'datestring':
      return value ? moment(value).format(dateFormatStyle) : '';
      break;

    case 'date':
      return value ? moment(value).format(dateFormatStyle) : '';
      break;
    case 'tin':
      return value
        ? value.map(item => {
            const matchedCountry =
              item && item.countryCode && getCountryLabel(item.countryCode);
            return (
              <div>
                {matchedCountry || ''} {item.tin}
              </div>
            );
          })
        : '';

    default:
      return value;
      break;
  }
};

export const getImageValue = (value, isImage, inline) => {
  //isImage暂时通过手动传参的方式来显示Tw图片
  if (value instanceof Array && !value.length) {
    value = '';
  }
  const realFileName = value ? value.split('/').pop() : '';
  let fileExt = value.split('.').pop();
  const fileName = realFileName.replace(
    /(.*)_(.*)(\.\w+)$/,
    (m, name, randomstr, ext) => {
      return `${name}${ext}`;
    }
  );
  return imageExtensions.includes(fileExt) || isImage ? (
    <Image value={value} inline={inline} />
  ) : (
    <a className="file-text" href={value} target="_blank">
      {realFileName !== fileName ? fileName : i18n['upload.view_file']}
    </a>
  );
};

export default getFieldValue;
