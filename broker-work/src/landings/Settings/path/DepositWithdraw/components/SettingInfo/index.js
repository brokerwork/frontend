import { Table, Button, Dialog } from 'lean-ui';
import i18n from 'utils/i18n';
import cs from './SettingInfo.less';

export default class SettingInfo extends PureComponent {
  columns = [
    {
      name: i18n['settings.deposit_withdraw.setting.setting_info.module'],
      key: 'module'
    },
    {
      name: i18n['settings.deposit_withdraw.setting.setting_info.field'],
      key: 'field'
    },
    {
      name: i18n['settings.deposit_withdraw.setting.setting_info.logic'],
      key: 'logic'
    }
  ];
  data = [
    {
      module: i18n['report.account_table_type.accounts_summary'],
      field: `${i18n['settings.deposit_withdraw.deposit']}/${
        i18n['settings.deposit_withdraw.withdraw']
      }`,
      logic: i18n['settings.deposit_withdraw.latest_enable']
    },
    {
      module: i18n['report.account_table_type.account_dw'],
      field: `${i18n['settings.deposit_withdraw.deposit']}/${
        i18n['settings.deposit_withdraw.withdraw']
      }`,
      logic: i18n['settings.deposit_withdraw.latest_enable']
    },
    {
      module: i18n['report.commission_table_type.Deposit'],
      field: i18n['settings.deposit_withdraw.deposit_statistics'],
      logic: i18n['settings.deposit_withdraw.latest_enable']
    }
    // {
    //   module: `${i18n['navigation.dashboard']}-${
    //     i18n['dashboard.navigator.achievements.trade']
    //   }`,
    //   field: `${i18n['settings.deposit_withdraw.deposit']}/${
    //     i18n['settings.deposit_withdraw.withdraw']
    //   }/${i18n['settings.deposit_withdraw.net_deposit']}`,
    //   logic: i18n['settings.deposit_withdraw.current_enable']
    // },
    // {
    //   module: `${i18n['navigation.dashboard']}-${
    //     i18n['dashboard.navigator.achievements.staff_performance']
    //   }`,
    //   field: `${i18n['settings.deposit_withdraw.deposit']}/${
    //     i18n['settings.deposit_withdraw.withdraw']
    //   }/${i18n['settings.deposit_withdraw.net_deposit']}`,
    //   logic: i18n['settings.deposit_withdraw.current_enable']
    // },
    // {
    //   module: `${i18n['navigation.dashboard']}-${
    //     i18n['dashboard.navigator.customer_source.transfom_trends']
    //   }`,
    //   field: i18n['settings.deposit_withdraw.deposit_amount'],
    //   logic: i18n['settings.deposit_withdraw.current_enable']
    // },
    // {
    //   module: `${i18n['navigation.dashboard']}-${
    //     i18n['settings.deposit_withdraw.customer_summary']
    //   }`,
    //   field: `${i18n['settings.deposit_withdraw.deposit']}/${
    //     i18n['settings.deposit_withdraw.withdraw']
    //   }/${i18n['settings.deposit_withdraw.net_deposit']}`,
    //   logic: i18n['settings.deposit_withdraw.current_enable']
    // },
    // {
    //   module: `${i18n['navigation.dashboard']}-${
    //     i18n['dashboard.navigator.customer_data.customer_rankings']
    //   }`,
    //   field: `${i18n['settings.deposit_withdraw.deposit']}/${
    //     i18n['settings.deposit_withdraw.withdraw']
    //   }/${i18n['settings.deposit_withdraw.net_deposit']}`,
    //   logic: i18n['settings.deposit_withdraw.current_enable']
    // }
  ];
  renderCell({ data }) {
    return <Table.Td>{data}</Table.Td>;
  }
  render() {
    const { onClose } = this.props;

    return (
      <Dialog
        onCancel={onClose}
        title={i18n['settings.deposit_withdraw.setting.setting_info.title']}
        visible={true}
        width={700}
        footer={
          <Button type="primary" onClick={onClose}>
            {i18n['general.i_know']}
          </Button>
        }
      >
        <div className={cs['tips']}>
          {i18n['settings.deposit_withdraw.setting.setting_info.tips']}
        </div>
        <Table
          data={this.data}
          columns={this.columns}
          renderCell={this.renderCell}
        />
      </Dialog>
    );
  }
}
