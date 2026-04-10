import Tag from 'components/Tag';
import cs from '../AdvancedSearch.less';
import i18n from 'utils/i18n';
import { Button } from 'react-bootstrap';
import Tips from 'components/Tips';
import moment from 'moment';

export default class Tags extends Component {
  getFieldName = field => {
    const { types } = this.props;
    const matched = types.find(item => item.value === field);
    return (matched && matched.label) || '';
  };
  getConditionName = condition => {
    const { conditions } = this.props;
    const matched = conditions.find(item => item.value === condition);
    return (matched && matched.label) || '';
  };
  getfieldValue = (data, type, condition) => {
    if (!data || !type || !condition) return;
    if (Array.isArray(data)) {
      const isRange =
        type.rangeConditions &&
        (type.rangeConditions === true ||
          type.rangeConditions.includes(condition));
      const splitChar = isRange ? '~' : ',';
      return data
        .map(v => this.getfieldValue(v, type, condition))
        .join(splitChar);
    }
    if (type.fieldType === 'date') {
      if (data.startDate) {
        return this.getfieldValue(
          [data.startDate, data.endDate],
          type,
          condition
        );
      } else if (data.format) {
        return data.format('YYYY-MM-DD');
      } else if (data) {
        return moment(data).format('YYYY-MM-DD');
      }
    }
    return data.label || data;
  };
  render() {
    const {
      data,
      onClean,
      goAdvanceSearch,
      goGeneralSearch,
      onRemoveItem,
      types,
      toggleSaveModal,
      readonly = false
    } = this.props;
    const { disableValueConditions, logicType } = this.props;
    const logicTypesMap = {
      AND: i18n['advanced_search.tabs.and.tips'],
      OR: i18n['advanced_search.tabs.or.tips']
    };
    const tagClass = cs[`tags-${logicType.toLowerCase()}`];
    return (
      <div className={`${cs['stage-content']}}  ${tagClass}`}>
        {data.map((item, i) => {
          const { condition, value, field } = item;
          const matchedType = types.find(type => type.value === field);
          const fieldName = this.getFieldName(field) || '';
          const conditionName = this.getConditionName(condition) || '';
          const fieldValue =
            this.getfieldValue(value, matchedType, condition) || '';
          const content = `${fieldName} ${conditionName} ${fieldValue}`;
          return (
            <Tag key={i} className={cs['tag']}>
              <span title={content}>{content}</span>
              {!readonly ? (
                <i
                  className="fa fa-remove"
                  onClick={onRemoveItem.bind(this, i)}
                />
              ) : (
                undefined
              )}
            </Tag>
          );
        })}
        <div className={`${cs['button-bar']} ${cs['button-bar-inline']}`}>
          <span className={cs['ques-tips-trigger']}>
            <Tips
              hover
              className={cs[`ques-icon-${logicType.toLowerCase()}`]}
              icon="fa fa-question-circle"
              align="top"
            >
              <div className={cs['ques-content']}>
                {logicTypesMap[logicType]}
              </div>
            </Tips>
          </span>
          {!readonly
            ? [
                <Button key={0} onClick={goGeneralSearch}>
                  <span className="fa fa-rotate-left" />
                  {i18n['advanced_search.clearn_tags']}
                </Button>,
                <Button
                  key={1}
                  bsStyle="primary"
                  onClick={toggleSaveModal}
                  disabled={!data.length}
                >
                  {i18n['advanced_search.save_conditions']}
                </Button>
              ]
            : undefined}
          {/* <Button bsStyle="primary" onClick={goAdvanceSearch}>
          <span className="fa fa-search"></span>{i18n['advanced_search.advanced_search']}
        </Button>
        <Button bsStyle="primary" onClick={goGeneralSearch}>{i18n['advanced_search.general_search']}
        </Button> */}
        </div>
      </div>
    );
  }
}
