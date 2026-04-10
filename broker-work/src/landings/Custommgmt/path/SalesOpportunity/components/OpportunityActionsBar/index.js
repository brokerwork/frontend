// import { FormControl, Button } from 'react-bootstrap';
// import Dropdown from 'components/Dropdown';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import cs from './OpportunityActionsBar.less';
import { Icon, Dropdown, Menu, Button, Input, Breadcrumb } from 'lean-ui';
import ConditionFilter from 'components/v2/ConditionFilter';
import { Summary } from 'components/v2/PageWraper';

export default class OpportunityActionsBar extends PureComponent {
  componentDidMount() {
    const { getSalesStageList, getSearchTypeList } = this.props;

    getSearchTypeList();
    getSalesStageList().then(({ result }) => {
      if (result) {
        this.getOpportunityList();
      }
    });
  }

  getOpportunityList = () => {
    const { getOpportunityList, searchText, currentPagination } = this.props;
    const { pageSize } = currentPagination;

    getOpportunityList({
      currentPage: 1,
      fuzzyVal: searchText,
      pageSize
    });
  };

  onSalesStageSelect = selected => {
    const { updateCurrentSalesStage, updateSearchText } = this.props;
    Promise.all([updateSearchText(''), updateCurrentSalesStage(selected)]).then(
      () => {
        this.getOpportunityList();
      }
    );
  };

  onFilterTypeSelect = selected => {
    const { updateCurrentFilterType, updateSearchText } = this.props;
    Promise.all([updateSearchText(''), updateCurrentFilterType(selected)]).then(
      () => {
        this.getOpportunityList();
      }
    );
  };

  onSearchTypeSelect = selected => {
    const { updateCurrentSearchType } = this.props;

    updateCurrentSearchType(selected);
  };

  onSearchTextChange = evt => {
    const { updateSearchText } = this.props;

    updateSearchText(evt.target.value);
  };

  onSearch = evt => {
    this.getOpportunityList();
  };

  remove = () => {
    const {
      selecteds,
      showTipsModal,
      showTopAlert,
      updateSelecteds,
      remove
    } = this.props;

    showTipsModal({
      content: i18n['customer.sales_opportunity.actions_bar.remove_tips'],
      onConfirm: cb => {
        const ids = selecteds.map(item => item.opportunityId);
        remove(ids).then(({ result, data }) => {
          if (result) {
            if (data && data.length) {
              showTipsModal({
                content: (
                  <FormattedMessage
                    id="customer.sales_opportunity.detail.delete_reject_batch"
                    defaultMessage={
                      i18n[
                        'customer.sales_opportunity.detail.delete_reject_batch'
                      ]
                    }
                    values={{
                      successNum: (
                        <span className={cs['success-text']}>
                          {ids.length - data.length}
                        </span>
                      ),
                      failNum: (
                        <span className={cs['fail-text']}>{data.length}</span>
                      )
                    }}
                  />
                ),
                noCancel: true
              });
            } else {
              showTopAlert({
                bsStyle: 'success',
                content: i18n['general.remove_success']
              });
              cb();
            }
            updateSelecteds([]);
            this.getOpportunityList();
          } else {
            cb();
          }
        });
      }
    });
  };

  cancel = () => {
    const { updateSelecteds } = this.props;

    updateSelecteds([]);
  };

  render() {
    const {
      salesStageList,
      filterTypeList,
      searchTypeList,
      currentSalesStage,
      currentFilterType,
      currentSearchType,
      searchText,
      selecteds,
      userRights,
      listUpdateTime,
      opportunityList
    } = this.props;
    return (
      <div className={cs['actions-bar']}>
        <div className={cs['left-part']}>
          <div className={cs['primary-top-title']}>
            <Icon
              fontType="bw"
              icon="customer-color"
              className={`main-color ${cs['customer-icon']}`}
            />
            <div className={cs['module-info']}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  {i18n['navigation.customer.sales_opportunity']}
                </Breadcrumb.Item>
              </Breadcrumb>
              <ConditionFilter.ViewList />
            </div>
          </div>
          <Summary.Info
            total={opportunityList.total}
            // orderBy={sortLabel}
            updateTime={listUpdateTime}
          />
        </div>
        <div className={cs['right-part']}>
          <div className={cs['button-area']} />
          <div className={cs['search-input']}>
            <Input
              suffix={<Icon icon="search" />}
              placeholder={
                i18n['customer.sales_opportunity.search.placeholder']
              }
              value={searchText}
              onChange={this.onSearchTextChange}
              onPressEnter={this.onSearch}
            />
          </div>
        </div>
      </div>
    );
    // return (
    //   <div className={cs['actions-bar']}>
    //     {selecteds.length ? (
    //       <div className={cs['wrapper']}>
    //         <div className={cs['text']}>
    //           <FormattedMessage
    //             id="customer.sales_opportunity.actions_bar.selected_tips"
    //             defaultMessage={
    //               i18n['customer.sales_opportunity.actions_bar.selected_tips']
    //             }
    //             values={{
    //               number: <span className="badge">{selecteds.length}</span>
    //             }}
    //           />
    //         </div>
    //         <Button
    //           bsStyle="primary"
    //           className={cs['btn']}
    //           onClick={this.cancel}
    //         >
    //           {i18n['customer.sales_opportunity.actions_bar.cancel']}
    //         </Button>
    //         {userRights['CUSTOMER_SALEOPP_DELETE'] ? (
    //           <Button
    //             bsStyle="primary"
    //             className={cs['btn']}
    //             onClick={this.remove}
    //           >
    //             {i18n['customer.sales_opportunity.actions_bar.remove']}
    //           </Button>
    //         ) : (
    //           undefined
    //         )}
    //       </div>
    //     ) : (
    //       <div className={cs['wrapper']}>
    //         <Dropdown
    //           className={cs['dropdown']}
    //           data={salesStageList}
    //           value={currentSalesStage}
    //           autoWidth
    //           onSelect={this.onSalesStageSelect}
    //         />
    //         <Dropdown
    //           className={cs['dropdown']}
    //           data={filterTypeList}
    //           autoWidth
    //           value={currentFilterType}
    //           onSelect={this.onFilterTypeSelect}
    //         />
    //       </div>
    //     )}
    //     <div className={cs['search-bar']}>
    //       <Dropdown
    //         className={cs['search-dropdown']}
    //         data={searchTypeList}
    //         value={currentSearchType}
    //         onSelect={this.onSearchTypeSelect}
    //       />
    //       <FormControl
    //         type="text"
    //         placeholder={i18n['account.search.placeholder']}
    //         value={searchText}
    //         onChange={this.onSearchTextChange}
    //         onKeyPress={this.onSearch}
    //       />
    //     </div>
    //   </div>
    // );
  }
}
