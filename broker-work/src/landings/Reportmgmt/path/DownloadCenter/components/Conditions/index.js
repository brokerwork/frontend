import ConditionFilter from 'components/v2/ConditionFilter';
import _ from 'lodash';
import i18n from 'utils/i18n';
import { ADVANCED_SEARCH_CONDITIONS } from '../../../../constant';

export default class Conditions extends PureComponent {
  onAdvancedSearch = (data, logicType, viewId, resetType) => {};
  render() {
    const {
      children,
      match: { params: { type } = {} }
    } = this.props;
    return (
      <ConditionFilter.Container
        onSearch={this.onAdvancedSearch}
        conditions={ADVANCED_SEARCH_CONDITIONS}
      >
        {children}
      </ConditionFilter.Container>
    );
  }
}
