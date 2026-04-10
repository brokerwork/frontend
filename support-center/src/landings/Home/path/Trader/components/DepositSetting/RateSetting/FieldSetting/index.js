import Table from 'components/Table';
import Form from 'components/Form';
import { Field } from 'redux-form';

import i18n from 'utils/i18n';
import cs from './index.less';
const columns = [
  {
    key: 'fieldId',
    label: i18n['trader.plat.setting.deposit.telegraphic.fieldId']
  },
  {
    key: 'required',
    label: i18n['trader.plat.setting.deposit.telegraphic.required']
  }
];
export default class TelegraphicForm extends PureComponent {
  componentDidMount() {
    const { fields } = this.props;
    fields.forEach(el => {
      this.setState({
        [el.fieldId]: el.required
      });
    });
    this.fields = _.cloneDeep(fields);
  }
  state = {};
  renderHeader = () => {
    return columns.map(col => {
      return <th key={col.key}>{col.label}</th>;
    });
  };
  renderTableBody = data => {
    return data.map((item, key) => this.renderCell(item, key));
  };
  onChange = (id, e) => {
    const value = e.target.value;
    this.fields.find(el => el.fieldId === id).required = value;
    this.props.onChangeField(this.fields);
    this.setState({
      [id]: value
    });
  };
  renderCell = (item, key) => {
    console.log('keyy', item);
    return (
      <tr key={key}>
        {columns.map(col => {
          let content = '';
          switch (col.key) {
            case 'fieldId':
              content = i18n[`trader.plat.setting.deposit.telegraphic.${item[col.key]}`];
              break;
            default:
              content = (
                <select
                  className={cs.select}
                  disabled={item.fieldId === 'depositAmount'}
                  value={this.state[item.fieldId]}
                  onChange={this.onChange.bind(this, item.fieldId)}
                >
                  <option value={true}>{i18n['trader.plat.setting.deposit.telegraphic.options.required']}</option>
                  <option value={false}>{i18n['trader.plat.setting.deposit.telegraphic.options.notRequired']}</option>
                </select>
              );
          }
          return <td key={col.key}>{content}</td>;
        })}
      </tr>
    );
  };
  render() {
    const { fields } = this.props;
    return (
      <Table>
        <Table.Header data={columns}>{this.renderHeader()}</Table.Header>
        <Table.Body data={columns}>{this.renderTableBody(fields)}</Table.Body>
      </Table>
    );
  }
}
