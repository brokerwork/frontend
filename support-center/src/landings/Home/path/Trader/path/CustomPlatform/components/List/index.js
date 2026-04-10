import Table from 'components/Table';
import i18n from 'utils/i18n';
import Button from 'components/Button';
import cs from './index.less';
import { getPlatFormTypeLabel } from '../../constants';

export default class List extends PureComponent {
  componentDidMount() {
    const { getList } = this.props;
    getList();
  }

  render() {
    const { list, onClickEditPlatform } = this.props;

    return list.length > 0 ? (
      <Table>
        <Table.Header>
          <th>{i18n['trader.customPlatform.form.name']}</th>
          <th>{i18n['trader.customPlatform.form.type']}</th>
          <th>{i18n['general.operation']}</th>
        </Table.Header>
        <Table.Body>
          {list.map((item, index) => {
            const trK = `${index}${item.id}`;
            return (
              <tr key={trK}>
                <td>{item.name}</td>
                <td>{getPlatFormTypeLabel(item.platformType)}</td>
                <td>
                  <Button style="primary" onClick={onClickEditPlatform.bind(this, item)}>
                    {i18n['trader.customPlatform.table.edit']}
                  </Button>
                </td>
              </tr>
            );
          })}
        </Table.Body>
      </Table>
    ) : (
      <div className={cs['nodata']}>{i18n['trader.customPlatform.table.nodata']}</div>
    );
  }
}
