import i18n from 'utils/i18n';
import { Icon, Input } from 'lean-ui';

export default class Search extends PureComponent {
  onChange = evt => {
    const { updateFuzzyVal } = this.props;

    updateFuzzyVal(evt.target.value);
  };

  onSearch = evt => {
    const { onChange, updateSelectedAccountIds } = this.props;

    if (evt.which === 13) {
      onChange();
      updateSelectedAccountIds([]);
    }
  };

  render() {
    const { fuzzyValue } = this.props;

    return (
      <Input
        suffix={<Icon icon="search" />}
        onChange={this.onChange}
        onKeyPress={this.onSearch}
        value={fuzzyValue}
        placeholder={i18n['account.list.search.placehold']}
      />
    );
  }
}
