import cs from './ActionBar';
import i18n from 'utils/i18n';
import { Summary } from 'components/v2/PageWraper';
import { Icon, Breadcrumb, Button, Input } from 'lean-ui';
import TypePicker from '../../../../components/TypePicker';
import ConditionPicker from '../../../../components/ConditionPicker';
import { TIME_OPTIONS } from '../../../../../Msgmgmt/constant';

// 消息类型选项
const TYPES_OPTIONS = [
  { label: i18n['message.types.ALL'], value: 'ALL' },
  { label: i18n['message.types.WEB'], value: 'WEB' },
  { label: i18n['message.types.WEB_ALERT'], value: 'WEB_ALERT' }
];

export default class ActionBar extends PureComponent {
  componentDidMount() {
    const { initialParams } = this.props;
    initialParams('INBOX');
  }
  componentWillUnmount() {
    this.props.resetData();
  }

  onSelectCondition = value => {
    this.modifyParams('isActive', value === 'threeMonth');
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

  markAllAsRead = () => {
    const {
      markAllAsRead,
      showTipsModal,
      getMessages,
      searchParams
    } = this.props;
    showTipsModal({
      content: i18n['message.mark_all_as_read.tips'],
      onConfirm: cb => {
        markAllAsRead().then(r => {
          if (!r.result) return;
          cb();
          getMessages(searchParams);
        });
      }
    });
  };

  onFuzzySearchTextChange = evt => {
    this.queryContent = evt.target.value;
  };

  render() {
    const {
      paginationInfo,
      listUpdateTime,
      searchParams: { queryKey, queryContent, type, isActive }
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
                <Breadcrumb.Item>{i18n['message.inbox']}</Breadcrumb.Item>
              </Breadcrumb>
              <TypePicker
                data={TYPES_OPTIONS}
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
          <div>
            <Button className={cs['clear-unread']} onClick={this.markAllAsRead}>
              {i18n['message.clear-unread']}
            </Button>
          </div>
          <div className={cs['condition-part']}>
            <ConditionPicker
              data={TIME_OPTIONS}
              selectedCondition={isActive ? 'threeMonth' : 'history'}
              onSelect={this.onSelectCondition}
            />
            <div className={cs['search-input']}>
              <Input
                suffix={<Icon icon="search" />}
                onChange={this.onFuzzySearchTextChange}
                onPressEnter={this.modifyParams.bind(this, 'searchType')}
                placeholder={i18n['message.fuzzy_search.placeholder.inbox']}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
