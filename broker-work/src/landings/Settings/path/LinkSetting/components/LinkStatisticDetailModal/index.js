// import Table from 'components/Table';
import i18n from 'utils/i18n';
import cs from './LinkStatisticDetailModal.less';
import { Dialog, Button, Table } from 'lean-ui';
const { Td } = Table;

export default class LinkStatisticDetailModal extends PureComponent {
  columnsNormal = [
    { key: 'name', name: i18n['settings.link_setting.user'] },
    { key: 'hitNumber', name: i18n['settings.link_setting.hit_count'] },
    { key: 'newCustomerNumber', name: i18n['settings.link_setting.new_count'] },
    {
      key: 'openAccountNumber',
      name: i18n['settings.link_setting.open_count']
    },
    {
      key: 'depositeNumber',
      name: i18n['settings.link_setting.deposite_count']
    }
  ];
  columnsAgent = [
    { key: 'name', name: i18n['settings.link_setting.user'] },
    { key: 'hitNumber', name: i18n['settings.link_setting.hit_count'] },
    { key: 'applyNumber', name: i18n['settings.link_setting.applyNumber'] },
    { key: 'passNumber', name: i18n['settings.link_setting.passNumber'] },
    { key: 'notPassNumber', name: i18n['settings.link_setting.notPassNumber'] }
  ];

  renderCell = ({ key, data, index }) => {
    return <Td key={key}>{data}</Td>;
  };

  renderTable = () => {
    const { data } = this.props;
    const userStatistic = data.userStatistic || [];
    let columns =
      data.type !== 'Agent' ? this.columnsNormal : this.columnsAgent;
    return (
      <Table
        columns={columns}
        data={userStatistic}
        renderCell={this.renderCell}
      />
    );
  };

  render() {
    const { onHide, data, brandInfo } = this.props;
    const userStatistic = data.userStatistic || [];
    return (
      <Dialog
        visible={true}
        onCancel={onHide}
        title={i18n['settings.link_setting.statistic_title']}
        footer={
          <Button type="primary" onClick={onHide}>
            {i18n['general.confirm']}
          </Button>
        }
      >
        {this.renderTable()}
      </Dialog>
    );
  }
}
