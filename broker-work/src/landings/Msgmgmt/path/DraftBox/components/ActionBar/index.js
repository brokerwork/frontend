import cs from './ActionBar';
import i18n from 'utils/i18n';
import { Summary } from 'components/v2/PageWraper';
import { Icon, Breadcrumb, Button, Input } from 'lean-ui';
import TypePicker from '../../../../components/TypePicker';
import ConditionPicker from '../../../../components/ConditionPicker';
import { TIME_OPTIONS } from '../../../../../Msgmgmt/constant';

export default class ActionBar extends PureComponent {
  componentDidMount() {
    const { initialParams } = this.props;
    initialParams('DRAFT');
  }
  componentWillUnmount() {
    this.props.resetData();
  }

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
      searchParams: { queryKey, queryContent, type, isActive },
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
                <Breadcrumb.Item>{i18n['message.draft_box']}</Breadcrumb.Item>
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
            <div className={cs['search-input']}>
              <Input
                suffix={<Icon icon="search" />}
                onChange={this.onFuzzySearchTextChange}
                onPressEnter={this.modifyParams.bind(this, 'searchType')}
                placeholder={i18n['message.fuzzy_search.placeholder.draft']}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
