import Table from 'components/FixTable';
import cs from './index.less';
import i18n from 'utils/i18n';
import Button from 'components/Button';
import language from 'utils/language';
import { getTenantId } from 'utils/tenantInfo';

export default class List extends Component {
  renderHeader = () => {
    return this.props.columns.map(col => {
      let content = i18n[`trader.form.${col.key}`];
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
      <tr key={item.key}>
        {columns.map(col => {
          let content = '';
          switch (col.key) {
            case 'sort':
              content = <i className="fa fa-bars" />;
              break;
            case 'fieldName':
              content = item.label;
              break;
            case 'required':
              content = item.required ? '是' : '否';
              break;
            case 'fieldProperty':
              content = item.sysDefault ? '系统默认字段' : '自定义字段';
              break;
            case 'status':
              content = item.enable ? '启用' : '禁用';
              break;
            case 'operation':
              content = (
                <div style={item.required ? { cursor: 'not-allowed' } : {}}>
                  <Button
                    style="primary"
                    className="icon"
                    disabled={item.required}
                    onClick={this.props.onDel.bind(null, index)}
                  >
                    <i className="fa fa-times" />
                  </Button>
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
  onSort = e => {
    const data = [...this.props.data];
    const { oldIndex, newIndex } = e;
    const item = data[oldIndex];
    data.splice(oldIndex, 1);
    data.splice(newIndex, 0, item);

    this.props.onSort(data);
  };
  render() {
    const { columns, data } = this.props;
    return (
      <div>
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
