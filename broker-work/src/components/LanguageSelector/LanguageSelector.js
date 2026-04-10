// import DropdownItem from '../DropdownItem';
import { countryCodeStaticDir, languages } from 'utils/config';
import { Dropdown, Menu, Icon, Button } from 'lean-ui';
import cs from './LanguageSelector.less';

const List = ({ data, onSelect }) => {
  return (
    <Menu onClick={onSelect}>
      {data.map((item, index) => {
        return <Menu.Item key={index}>{item.label}</Menu.Item>;
      })}
    </Menu>
  );
};

export default class LanguageSelector extends Component {
  onChange = ({ key }) => {
    const { onChange, languageSelectors, languages } = this.props;
    const d = languageSelectors || languages;
    const v = d[Number(key)];
    if (onChange) {
      onChange(v);
    }
  };
  render() {
    const {
      value,
      languageSelectors,
      className = '',
      accessConfig: { showFlag },
      ...props
    } = this.props;
    if (!value) {
      return null;
    }
    const d = languageSelectors || languages;
    console.log('dddddd', languageSelectors, languages);
    return (
      <Dropdown
        value={value}
        trigger="click"
        overlay={<List onSelect={this.onChange} data={d} />}
      >
        <Button className={cs['btn']}>
          {showFlag && (
            <img
              src={`${countryCodeStaticDir}${value.icon}`}
              width="18"
              height="12"
            />
          )}
          <span className={cs['text']}>{value.tag}</span>
          <Icon icon="arrow-down" />
        </Button>
      </Dropdown>
    );
  }
}
