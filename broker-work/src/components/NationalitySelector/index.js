import i18n from 'utils/i18n';
import { getCountry } from 'utils/country';
import { DropdownForCode } from 'components/Dropdown';

let countryData = getCountry();

export default class NationalitySelector extends PureComponent {
  render() {
    const { input, className, disabled } = this.props;
    if (!countryData) countryData = getCountry();
    const options = countryData.filter(item => item.pid === '0');

    return (
      <DropdownForCode
        {...input}
        disabled={disabled}
        data={options}
        defaultSelect
        className={`${className}`}
      />
    );
  }
}
