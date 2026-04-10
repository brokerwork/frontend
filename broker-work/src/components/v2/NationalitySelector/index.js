import i18n from 'utils/i18n';
import { getCountry } from 'utils/country';
import DropdownForCode from 'components/v2/DropdownForCode';

let countryData = getCountry();

export default class NationalitySelector extends PureComponent {
  render() {
    const { className, disabled } = this.props;
    if (!countryData) countryData = getCountry();
    const options = countryData.filter(item => item.pid === '0');

    return (
      <DropdownForCode
        {...this.props}
        disabled={disabled}
        data={options}
        defaultSelect
        className={`${className}`}
      />
    );
  }
}
