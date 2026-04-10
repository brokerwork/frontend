import { getCountry, getCountryObject } from 'utils/country';
import moment from 'moment';
import { dateFormatStyle } from 'utils/config';
import { imageExtensions } from 'utils/config';
import cls from 'utils/class';
import Image from 'components/Image';

let countryData = getCountryObject();

const getCountryLabel = (code) => {
  return countryData[code] || "";
}

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
      return value ? `${value.countryCode ? `${value.countryCode}` : ''} ${value.phone || ''}` : '';
      break;

    case 'checkbox':
      return value ? value.map((_v) => field.optionList.find((option) => option.value == _v).label).join('，') : '';
      break;

    case 'select':
      return value ? (field.optionList.find((option) => option.value == value) || {}).label : '';
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

    default:
      return value;
      break;
  }
};

const getImageValue = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();

  return imageExtensions.includes(ext)
          ? <Image value={fileName} />
          : <a className="file-text" href={fileName} target="_blank">查看文件</a>;
}

export default getFieldValue;
