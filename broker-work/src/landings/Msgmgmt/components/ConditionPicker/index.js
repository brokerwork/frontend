import cs from './ConditionPicker.less';
import i18n from 'utils/i18n';
import { Select } from 'lean-ui';

export default class ConditionPicker extends PureComponent {
  onSelectOpt = value => {
    const { onSelect } = this.props;
    onSelect && onSelect(value);
  };

  render() {
    const { data, selectedCondition } = this.props;

    // const selectedLabel = !!data
    //   ? data.find(item => item.value === selectedCondition).label
    //   : undefined;

    return (
      <Select
        placeholder={i18n['general.default_select']}
        value={selectedCondition}
        onSelect={this.onSelectOpt}
        disabled={false}
      >
        {data.map((item, index) => (
          <Select.Option key={index} value={item.value}>
            {item.label}
          </Select.Option>
        ))}
      </Select>
    );
  }
}
