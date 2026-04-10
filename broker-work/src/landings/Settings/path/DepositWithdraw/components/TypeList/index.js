import { Button, Table, Icon } from 'lean-ui';
import OperateType from '../../containers/OperateType';
import i18n from 'utils/i18n';
import { injectIntl } from 'react-intl';
import cs from './index.less';

class TypeList extends PureComponent {
  showOperateTypeModal = target => {
    const { setParams, type } = this.props;
    setParams(
      {
        showOperateTypeModal: true,
        target
      },
      type
    );
  };

  closeOperateTypeModal = () => {
    const { params, setParams, type } = this.props;
    setParams({ ...params, showOperateTypeModal: false }, type);
  };

  onSave = async () => {
    const { params, setParams, getDepositWithdrawInfo, type } = this.props;
    await setParams({ ...params, showOperateTypeModal: false }, type);
    getDepositWithdrawInfo();
  };

  removeType = target => {
    const {
      showTipsModal,
      showTopAlert,
      removeType,
      getDepositWithdrawInfo
    } = this.props;

    showTipsModal({
      content: i18n['settings.deposit_withdraw.remove.tips'],
      onConfirm: cb => {
        removeType(target.id).then(({ result }) => {
          if (result) {
            showTopAlert({
              bsStyle: 'success',
              content: i18n['general.remove_success']
            });
            cb();
            getDepositWithdrawInfo();
          }
        });
      }
    });
  };

  columns = [
    { name: i18n['settings.deposit_withdraw.type'], key: 'typeName' },
    { name: i18n['settings.deposit_withdraw.regular'], key: 'regular' },
    { name: i18n['general.control'], key: 'operation' }
  ];

  renderCell = ({ key, data, rowData }) => {
    const {
      intl: { formatMessage }
    } = this.props;
    const item = rowData;
    let d;
    switch (key) {
      case 'regular':
        d =
          item.regular === 'lean-work-other-' && item.defaulted
            ? ''
            : item.regular
                .split(',')
                .map(reg => {
                  return formatMessage(
                    {
                      id: 'settings.deposit_withdraw.regular_info',
                      defaultMessage:
                        i18n['settings.deposit_withdraw.regular_info']
                    },
                    {
                      regular: reg
                    }
                  );
                })
                .join(' or ');
        break;

      case 'operation':
        d = item.defaulted ? (
          i18n['settings.deposit_withdraw.system_default']
        ) : (
          <div className={cs.actions}>
            <Icon
              icon="edit-outline main-color"
              onClick={this.showOperateTypeModal.bind(this, item)}
            />
            <Icon
              icon="delete-outline main-color"
              onClick={this.removeType.bind(this, item)}
            />
          </div>
        );
        break;

      default:
        d = data;
        break;
    }

    return <Table.Td className={cs.font}>{d}</Table.Td>;
  };

  render() {
    const { list = [], type, params } = this.props;
    const { showOperateTypeModal, target } = params[type];
    return (
      <div>
        <Table
          columns={this.columns}
          data={list}
          renderCell={this.renderCell}
        />
        {showOperateTypeModal && (
          <OperateType
            target={target}
            type={type}
            onSave={this.onSave}
            onClose={this.closeOperateTypeModal}
          />
        )}
      </div>
    );
  }
}

export default injectIntl(TypeList);
