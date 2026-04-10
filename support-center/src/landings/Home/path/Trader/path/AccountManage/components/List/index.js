import Table from 'components/FixTable';
import cs from './index.less';
import i18n from 'utils/i18n';
import Button from 'components/Button';
import language from 'utils/language';
import { getTenantId } from 'utils/tenantInfo';

export default class List extends Component {
  renderHeader = () => {
    return this.props.columns.map(col => {
      let content = i18n[`trader.account.manage.table_header.${col.key}`];
      if (['sort', 'operation'].includes(col.key)) {
        content = i18n[`general.${col.key}`];
      }
      return <th key={col.key}>{content}</th>;
    });
  };
  renderTableBody = (data, sort) => {
    return data && data.length ? data.map((item, key) => this.renderCell(item, key)) : null;
  };
  renderCell = (item, index) => {
    const { columns, openEdit } = this.props;
    return (
      <tr key={item.customerAccountType}>
        {columns.map(col => {
          let content = '';
          switch (col.key) {
            case 'sort':
              content = <i className="fa fa-bars" />;
              break;
            case 'accountTypeName':
            case 'accountTypDesc':
              const Lang = language.getLang();
              content = item[col.key][Lang] || '——';
              break;
            case 'accountCategory':
              content = i18n[`trader.account.manage.${item[col.key]}`];
              break;
            case 'operation':
              content = (
                <div>
                  <Button style="primary" className="icon" onClick={openEdit.bind(this, index)}>
                    <i className="fa fa-pencil" />
                  </Button>
                  {!(item['accountCategory'] === 'Individual' && item['customerAccountType'] === 'Individual') && (
                    <Button style="primary" className="icon" onClick={this.deleteAccount.bind(this, item)}>
                      <i className="fa fa-times" />
                    </Button>
                  )}
                </div>
              );
              break;
            default:
              content = item[col.key];
          }
          return <td key={col.key}>{content}</td>;
        })}
      </tr>
    );
  };
  deleteAccount = item => {
    const { deleteAccountTypeConfig, showTipsModal, showTopAlert, getAccountTypeConfig } = this.props;
    showTipsModal({
      header: i18n['common.tips.risk'],
      content: i18n['general.confirm_remove'],
      onConfirm: cb => {
        deleteAccountTypeConfig(item.customerAccountType).then(res => {
          if (res.result) {
            showTopAlert({
              style: 'success',
              content: i18n['general.remove_success']
            });
            const tenantId = getTenantId();
            getAccountTypeConfig(tenantId);
            cb();
          }
        });
      },
      onCancel: cb => {
        cb();
      }
    });
  };
  arrTans(arr, oldIndex, newIndex) {
    const oldId = arr[oldIndex];
    arr.splice(oldIndex, 1);
    arr.splice(newIndex, 0, oldId);
    return arr;
  }
  onSort = event => {
    const { data, onSortAccount } = this.props;
    const { oldIndex, newIndex } = event;
    const copy = _.cloneDeep(data);
    const end = this.arrTans(copy, oldIndex, newIndex);
    if (oldIndex !== newIndex) {
      onSortAccount(end);
    }
  };
  render() {
    const { columns, data } = this.props;
    return (
      <div className={cs.list_container}>
        <Table>
          <Table.Header fixHeader={true} data={columns}>
            {this.renderHeader()}
          </Table.Header>
          <Table.Body sortable onSort={this.onSort} data={columns}>
            {this.renderTableBody(data)}
          </Table.Body>
        </Table>
      </div>
    );
  }
}
