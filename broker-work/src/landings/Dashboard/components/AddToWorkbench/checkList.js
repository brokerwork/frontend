import Checkbox from 'components/Checkbox';
import cs from './style.less';
import constants from '../constants';
import i18n from 'utils/i18n';

export default class CheckList extends PureComponent {
  constructor(props) {
    super(props);
    const { options, defaultVal = [] } = props;
    this.state = {
      selected: defaultVal,
      optionsWithChecked: options.map(opt => ({
        value: opt,
        label: constants[opt].label,
        checked: defaultVal.includes(opt)
      }))
    };
  }
  onOptChange(opt) {
    const { onChange } = this.props;
    const { optionsWithChecked } = this.state;
    let selected = [];
    let newOpts = optionsWithChecked.map(option => {
      return Object.assign({}, option, {
        checked: option.value === opt.value ? !option.checked : option.checked
      });
    });
    newOpts.forEach(val => {
      if (val.checked) {
        selected.push(val.value);
      }
    });
    this.setState(
      {
        selected,
        optionsWithChecked: newOpts
      },
      () => {
        onChange(selected);
      }
    );
  }
  render() {
    const { optionsWithChecked } = this.state;
    return (
      <div className={cs['check-list']}>
        {optionsWithChecked.length ? (
          <ul>
            {optionsWithChecked.map(item => (
              <li
                key={item.value}
                className={cs['item']}
                onClick={this.onOptChange.bind(this, item)}
              >
                {i18n[item.label]}
                <i
                  className={`check-list-font fa fa-check-circle ${
                    item.checked ? 'main-color' : ''
                  }`}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }
}
