import cs from './ActionBar';
import i18n from 'utils/i18n';
import { Summary } from 'components/v2/PageWraper';
import { Icon, Breadcrumb, Button, Input } from 'lean-ui';
import TypePicker from '../../../../components/TypePicker';
import ConditionPicker from '../../../../components/ConditionPicker';
import { QUERY_TYPE_OPTIONS } from '../../../../../Msgmgmt/constant';

export default class ActionBar extends PureComponent {
  componentDidMount() {
    const { initialParams } = this.props;
    initialParams('RECYCLE_INBOX');
  }
  componentWillUnmount() {
    this.props.resetData();
  }

  onSelectCondition = value => {
    this.modifyParams('queryType', value);
  };

  modifyParams(field, value) {
    const { searchParams, modifyParams } = this.props;
    const params = { ...searchParams };
    if (field === 'searchType') {
      // params['queryKey'] = value['type'];
      params['queryContent'] = value.target.value;
    } else {
      params[field] = value;
      params['queryContent'] = '';
    }
    params['page'] = 1;
    modifyParams(params);
  }

  onFuzzySearchTextChange = evt => {
    this.queryContent = evt.target.value;
  };

  render() {
    const {
      paginationInfo,
      listUpdateTime,
      searchParams: { queryKey, queryContent, type, queryType },
      typesOptions
    } = this.props;

    return (
      <div className={cs['actions-bar']}>
        <div className={cs['left-part']}>
          <div className={cs['primary-top-title']}>
            <Icon
              fontType="bw"
              icon="message-color"
              className={`main-color ${cs['customer-icon']}`}
            />
            <div className={cs['module-info']}>
              <Breadcrumb>
                <Breadcrumb.Item>{i18n['message.recycle_bin']}</Breadcrumb.Item>
              </Breadcrumb>
              <TypePicker
                data={typesOptions}
                selectedType={type}
                onSelect={this.modifyParams.bind(this, 'type')}
              />
            </div>
          </div>
          <Summary.Info
            total={paginationInfo.total}
            updateTime={listUpdateTime}
          />
        </div>

        <div className={cs['right-part']}>
          <div className={cs['condition-part']}>
            <ConditionPicker
              data={QUERY_TYPE_OPTIONS}
              selectedCondition={queryType}
              onSelect={this.onSelectCondition}
            />
            <div className={cs['search-input']}>
              <Input
                suffix={<Icon icon="search" />}
                onChange={this.onFuzzySearchTextChange}
                onPressEnter={this.modifyParams.bind(this, 'searchType')}
                placeholder={i18n['message.fuzzy_search.placeholder.recycle']}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
