import PaginationBar from 'components/v2/PaginationBar';
import PagePanel from 'components/PagePanel';
import cs from './style.less';
import i18n from 'utils/i18n';
import ActionBar from '../../containers/ActionsBar';
import { substring } from 'utils/substring';
import EditModal from '../EditModal';
import { SOURCE_HEADER } from '../../../../../constants';
import SortToggle from 'components/v2/SortToggle';
import { Table as UiTable, Message, Button } from 'lean-ui';
const { Td, Th } = UiTable;

export default class Root extends Component {
  constructor(props) {
    super();
    this.state = { showEditModal: false, editSource: {} };
  }

  componentDidMount() {
    const { getList, searchParams, isExpire } = this.props;
    getList(searchParams);
    isExpire();
  }
  modifySort = k => {
    const { searchParams, modifySearchParams } = this.props;
    modifySearchParams({
      ...searchParams,
      currPage: 1,
      orderValue: k,
      sort: !searchParams.sort
    });
  };
  modifyPagination = v => {
    const { searchParams, modifySearchParams } = this.props;
    modifySearchParams({
      ...searchParams,
      pageSize: v.pageSize,
      currPage: v.pageNo
    });
  };
  optionsClick(source) {
    const { lockSource, unlockSource } = this.props;
    if (source.state === 0) {
      lockSource(source.tradeId, source.serverId);
    }
    if (source.state === 2 || source.state === 3) {
      unlockSource(source.tradeId, source.serverId);
    }
  }
  avgPositionTimeDisplay(avgPositionTime) {
    const val = Number(avgPositionTime);
    if (val === 0) {
      return `0${i18n['runmgmt.source_setting.min']}`;
    }
    if (val > 0 && val < 3600) {
      let y = Math.floor(val / 60);
      if (y < 1) {
        y = 1;
      }
      if (y > 59 && y < 60) {
        y = 59;
      }
      return `${y}${i18n['runmgmt.source_setting.min']}`;
    }
    if (val >= 3600 && val < 3600 * 24) {
      let y = Math.floor(val / (60 * 60));
      return `${y}${i18n['runmgmt.source_setting.hour']}`;
    }
    if (val >= 3600 * 24) {
      let y = Math.floor(val / (60 * 60 * 24));
      return `${y}${i18n['runmgmt.source_setting.day']}`;
    }
  }
  tradeCycleDisplay(tradeCycle) {
    const val = Number(tradeCycle);
    if (val === 0) {
      return `0${i18n['runmgmt.source_setting.day']}`;
    }
    if (val > 0 && val < 60 * 60 * 24 * 30) {
      let y = Math.floor(val / (60 * 60 * 24));
      y = y || 1;
      return `${y}${i18n['runmgmt.source_setting.day']}`;
    }
    if (val >= 60 * 60 * 24 * 30) {
      let y = Math.floor(val / (60 * 60 * 24 * 30));
      return `${y}${i18n['runmgmt.source_setting.month']}`;
    }
  }

  closeEditModal = () => {
    this.setState({ showEditModal: false });
  };

  renderHeadCell = ({ item, index, fixed }) => {
    const {
      searchParams: { orderValue, sort }
    } = this.props;
    return (
      <Th key={index} fixed={fixed}>
        {['profit', 'profitRate'].includes(item.value) ? (
          <SortToggle
            activeSort={orderValue}
            orders={[true, false]}
            sortKey={item.value}
            activeOrder={sort}
            onChange={this.modifySort}
          >
            {item.label}
          </SortToggle>
        ) : (
          item.label
        )}
      </Th>
    );
  };

  _renderCellback = ({ data, index, rowData, listData }) => {
    let content = null;
    let clickHandler = null;
    let title;
    const key = listData['value'];
    const {
      match: { url }
    } = this.props;
    switch (key) {
      case 'strategy':
        title = rowData.investmentStrategy;
        content = substring(rowData.investmentStrategy, 10);
        break;
      case 'type':
        content = i18n[`runmgmt.source_setting.type.${rowData.type}`];
        break;
      case 'state':
        content = i18n[`runmgmt.source_setting.show.state.${rowData.state}`];
        break;
      case 'balance':
        content = `${rowData.balance} ${rowData.currency}`;
        break;
      case 'avgPositionTime':
        content = this.avgPositionTimeDisplay(rowData.avgPositionTime);
        break;
      case 'tradeCycle':
        content = this.tradeCycleDisplay(rowData.tradeCycle);
        break;
      case 'actions':
        content = (
          <div>
            {rowData.type === 1 && (
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  this.setState({
                    showEditModal: true,
                    editSource: rowData
                  });
                }}
              >
                {i18n['general.edit']}
              </Button>
            )}
            <Button
              size="small"
              className={cs['right-button']}
              type={rowData.state ? 'primary' : undefined}
              onClick={this.optionsClick.bind(this, rowData)}
            >
              {rowData.state ? i18n['general.start'] : i18n['general.freeze']}
            </Button>
          </div>
        );
        break;
      default:
        title = content = rowData[key];
        break;
    }
    return (
      <Td
        key={key}
        className={key === 'active' ? cs['active-actions'] : ''}
        onClick={clickHandler}
        title={title}
      >
        {content}
      </Td>
    );
  };

  render() {
    const {
      sourceList = { list: [] },
      navigationInfo,
      searchParams,
      submitForm,
      resetForm,
      editSource,
      expire
    } = this.props;
    const { showEditModal } = this.state;
    return (
      <PagePanel>
        <PagePanel.Header>
          {i18n['navigation.runmgmt.follow.source_setting']}
          {!expire && (
            <span className={cs['expire-text']}>
              {i18n['navigation.runmgmt.follow.expire']}
            </span>
          )}
        </PagePanel.Header>
        <PagePanel.Body className={cs['body']}>
          <ActionBar />
          <UiTable
            data={sourceList && sourceList.list}
            columns={SOURCE_HEADER}
            renderCell={this._renderCellback}
            renderHeadCell={this.renderHeadCell}
          />
          <PaginationBar
            onPageChange={this.modifyPagination}
            {...navigationInfo}
          />
        </PagePanel.Body>
        {showEditModal ? (
          <EditModal
            source={this.state.editSource}
            editSource={editSource}
            submitForm={submitForm}
            resetForm={resetForm}
            onClose={this.closeEditModal}
          />
        ) : (
          undefined
        )}
      </PagePanel>
    );
  }
}
