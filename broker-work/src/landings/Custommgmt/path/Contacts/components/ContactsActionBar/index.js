import Dropdown from 'components/v2/Dropdown';
import ContactsBatchActions from '../../containers/ContactsBatchActions';
import { DEFAULT_SEARCH_TYPE } from '../../constant';
import i18n from 'utils/i18n';
import cs from './ContactsActionBar.less';

export default class ContactsActionBar extends PureComponent {
  componentDidMount() {
    const { setSearchType, getPrivilegeType } = this.props;
    setSearchType(DEFAULT_SEARCH_TYPE);
    Promise.resolve(getPrivilegeType()).then(() => {
      this.getContactsList();
    });
  }

  getContactsList = () => {
    const {
      getContactsList,
      fuzzyItem,
      fuzzyVal,
      currentPrivilegeType,
      currentPage
    } = this.props;
    getContactsList({
      filterType: currentPrivilegeType.value,
      fuzzyItem: fuzzyItem.value,
      fuzzyVal: fuzzyVal,
      currentPage: currentPage.pageNo,
      pageSize: currentPage.pageSize
    });
  };

  onPrivilegeTypeSelect = selected => {
    const { updateCurrentPrivilegeType, updateSearchText } = this.props;
    updateSearchText('');
    updateCurrentPrivilegeType(selected);
    setTimeout(() => {
      this.getContactsList();
    }, 1);
  };

  onSearchTypeSelect = selected => {
    const { updateSearchType } = this.props;
    updateSearchType(selected);
  };
  onSearchTextChange = evt => {
    const { updateSearchText } = this.props;
    updateSearchText(evt.target.value);
  };

  onSearch = evt => {
    const { updatePagination, currentPage } = this.props;
    const newpage = 1;
    const pageSize = currentPage.pageSize;
    if (evt.which === 13) {
      Promise.resolve(updatePagination({ newpage, pageSize })).then(() => {
        this.getContactsList();
      });
    }
  };

  render() {
    const {
      privilegetype,
      currentPrivilegeType,
      searchType,
      fuzzyItem,
      fuzzyVal,
      userRights,
      selectedContactIds
    } = this.props;
    return (
      <div className={cs['actions-bar']}>
        {selectedContactIds.length > 0 ? (
          <ContactsBatchActions />
        ) : (
          <div className={cs['wrapper']}>
            {userRights.CUSTOMER_SELECT ? (
              <Dropdown
                className={cs['dropdown']}
                data={privilegetype}
                value={currentPrivilegeType}
                autoWidth
                placeholder={i18n['customer.privilege_type.placeholder']}
                onSelect={this.onPrivilegeTypeSelect}
              />
            ) : (
              undefined
            )}
          </div>
        )}

        <div className={cs['search-bar']}>
          <Dropdown
            className={cs['dropdown']}
            data={searchType}
            value={fuzzyItem}
            onSelect={this.onSearchTypeSelect}
          />
          <input
            type="text"
            className="form-control main-color-border-focus"
            value={fuzzyVal}
            onChange={this.onSearchTextChange}
            placeholder={i18n['account.search.placeholder']}
            onKeyPress={this.onSearch}
          />
        </div>
      </div>
    );
  }
}
