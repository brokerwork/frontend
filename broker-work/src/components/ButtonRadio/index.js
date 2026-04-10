import { Button } from 'lean-ui';
import cs from './index.less';
const ButtonGroup = Button.Group;
const isEquivalent = (a, b) => {
  let aProps = Object.keys(a);
  let bProps = Object.keys(b);

  if (aProps.length != bProps.length) {
    return false;
  }

  if (!aProps.every(prop => bProps.some(_prop => prop === _prop))) {
    return false;
  }

  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i];

    if (a[propName] != b[propName]) {
      return false;
    }
  }

  return true;
};
const compareValue = (a, b) => {
  if (typeof a !== 'object') {
    return a == b;
  }

  return isEquivalent(a, b);
};
export default class Container extends Component {
  onSelect = selected => {
    const { onSelect, value, code, toggle } = this.props;
    const _value = (value && value.value) || code;
    if (onSelect) {
      if (selected.value === _value && toggle) {
        onSelect(undefined, '');
      } else {
        onSelect(selected, selected.value);
      }
    }
  };
  render() {
    const { bsSize, data, onSelect, value, code, disabled, focus } = this.props;
    const _value = (value && value.value) || code;
    return (
      <ButtonGroup bsSize={bsSize} className={focus ? cs['focus'] : ''}>
        {data.map((item, i) => {
          const isMatch = compareValue(item.value, _value);
          const className = isMatch ? cs['active'] : '';
          return (
            <Button
              key={i}
              disabled={disabled}
              className={`${cs['button']} ${className}`}
              onClick={this.onSelect.bind(this, item)}
              value={item.value}
            >
              {item.label}
            </Button>
          );
        })}
      </ButtonGroup>
    );
  }
}
