import Dropdown from 'components/Dropdown';
import { post } from 'utils/ajax';
import Badge from 'components/Badge';
import {
  AGENT_DEPOSIT_RRPORT_HEADERS,
  AGENT_SEARCH_TYPE
} from '../../../../constant';
import i18n from 'utils/i18n';
import { get as getQuery, set as setQuery } from 'utils/cacheQuery';

import cs from './ActionsBar.less';

export default class AgentDepositActionBar extends PureComponent {
  componentDidMount() {
    const {
      updateAgentDepositColumns,
      getAgentDepositList,
      getSearchType
    } = this.props;
    Promise.all([
      (updateAgentDepositColumns(AGENT_DEPOSIT_RRPORT_HEADERS),
      getSearchType(AGENT_SEARCH_TYPE))
    ]).then(() => {
      this.getAgentDepositList();
    });
  }

  getAgentDepositList = () => {
    const {
      getAgentDepositList,
      updateNeedRefresh,
      accountQueryItem,
      accountQueryValue,
      currentPagination
    } = this.props;
    const { pageNo, pageSize } = currentPagination;
    Promise.resolve(
      getAgentDepositList({
        name: accountQueryItem.value === 'name' ? accountQueryValue : '',
        login: accountQueryItem.value === 'login' ? accountQueryValue : '',
        pageNo: pageNo,
        pageSize: pageSize
      })
    ).then(res => {
      if (res.result) {
        if (res.data.list.length === 0) {
          updateNeedRefresh(i18n['report.date_range_type.default_no_results']);
        } else {
          updateNeedRefresh('');
        }
      }
    });
  };
  onSearchTypeSelect = selected => {
    const { updateSearchType } = this.props;
    Promise.resolve(updateSearchType(selected)).then(() => {
      setQuery('accountQueryItem')(this.props);
    });
  };
  onSearchTextChange = evt => {
    const { updateSearchText } = this.props;
    updateSearchText(evt.target.value);
  };

  onSearch = evt => {
    if (evt.which === 13) {
      this.getAgentDepositList();
    }
  };

  render() {
    const { accountQueryItem, accountQueryValue, searchType } = this.props;
    return (
      <div className={cs['action-bar']}>
        <div className={cs['wrapper']}>
          <div className={`${cs['search-bar']} ${cs['item']}`}>
            <Dropdown
              className={`${cs['dropdown']}  focus`}
              buttonClassName={cs['typing-select']}
              data={searchType}
              icon={'fa fa-angle-down'}
              value={accountQueryItem}
              onSelect={this.onSearchTypeSelect}
            />
            <input
              type="text"
              data-test={'search-Input'}
              placeholder={i18n['account.search.placeholder']}
              className={`${cs['typing-input']} form-control focus`}
              value={accountQueryValue}
              onChange={this.onSearchTextChange}
              onKeyPress={this.onSearch}
            />
          </div>
        </div>
      </div>
    );
  }
}
