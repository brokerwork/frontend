import Table from 'components/FixTable';
import i18n from 'utils/i18n';
import Button from 'components/Button';
import cs from './index.less';
import language from 'utils/language';

export default class List extends PureComponent {
  constructor(props) {
    super(props);
  }
  renderHeader = () => {
    return this.props.columns.map(col => {
      let content = i18n[`trader.plat.setting.open_account.simulation.table_header.${col.key}`];
      if (['sort', 'operation'].includes(col.key)) {
        content = i18n[`general.${col.key}`];
      }
      return <th key={col.key}>{content}</th>;
    });
  };
  renderTableBody = data => {
    return data && data.length && data.map((item, key) => this.renderCell(item, key));
  };
  deleteAccount = item => {
    const { deleteAccountType, plat, productId, getPlatSetting, showTipsModal, showTopAlert } = this.props;
    const params = {
      structural: plat,
      typeId: item.typeId,
      productId
    };
    showTipsModal({
      header: i18n['common.tips.risk'],
      content: i18n['general.confirm.tips'],
      onConfirm: cb => {
        deleteAccountType(params).then(res => {
          if (res.result) {
            showTopAlert({
              style: 'success',
              content: i18n['general.remove_success']
            });
            getPlatSetting(plat);
            cb();
          }
        });
      },
      onCancel: cb => {
        cb();
      }
    });
  };
  renderCell = (item, key) => {
    const { columns, editAccount, plat } = this.props;
    return (
      <tr key={key}>
        {columns.map(col => {
          let content = '';
          switch (col.key) {
            case 'operation':
              content = (
                <div>
                  <Button style="primary" className="icon" onClick={editAccount.bind(this, item)}>
                    <i className="fa fa-pencil" />
                  </Button>
                  <Button className="icon" onClick={this.deleteAccount.bind(this, item)}>
                    <i className="fa fa-times" />
                  </Button>
                </div>
              );
              break;
            case 'typeName':
              if (plat === 'CTRADER') {
                content = item[col.key];
              } else {
                const lang = language.getLang();
                content = item['typeNames'] ? item['typeNames'][lang] : '';
              }
              break;
            default:
              content = item[col.key];
          }
          return <td key={col.key}>{content}</td>;
        })}
      </tr>
    );
  };

  render() {
    const { data } = this.props;
    return (
      <div className={cs.list_container}>
        <Table>
          <Table.Header fixHeader={true}>{this.renderHeader()}</Table.Header>
          <Table.Body>{this.renderTableBody(data)}</Table.Body>
        </Table>
      </div>
    );
  }
}
