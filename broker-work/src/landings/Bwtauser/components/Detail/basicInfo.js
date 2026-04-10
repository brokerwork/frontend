import i18n from 'utils/i18n';
import cs from './index.less';
import { Table as UiTable } from 'lean-ui';
import { TW_USER_DETAIL } from '../../constants';
import CostomerSelector from 'components/CustomerSelector';
const { Td, Th } = UiTable;
export default class BasicInfo extends Component {
  renderCell = ({ rowData, listData }) => {
    const key = listData.value;
    let clickHandler = null;
    let title;
    return (
      <Td
        key={key}
        className={'active-actions'}
        onClick={clickHandler}
        title={title}
      >
        {key === 'mobilePhone'
          ? `${rowData.countryCode} ${rowData[key]}`
          : rowData[key]}
      </Td>
    );
  };
  renderHeadCell = ({ item, index, fixed }) => {
    return (
      <Th key={index} fixed={fixed}>
        {item.label}
      </Th>
    );
  };
  render() {
    const { userInfo } = this.props;
    return (
      <UiTable
        data={userInfo && userInfo ? [userInfo] : []}
        columns={TW_USER_DETAIL}
        renderCell={this.renderCell}
        renderHeadCell={this.renderHeadCell}
      />
    );
  }
}
