import Table from 'components/FixTable';
import i18n from 'utils/i18n';
import Radio from 'components/Radio';
import Button from 'components/Button';
import cs from './index.less';
import _ from 'lodash';
import EditModal from '../EditModal';
import AccountGroups from '../../../AccountGroups';
import language from 'utils/language';

/**
 * 列表项是否允许删除操作
 * @param item
 * @return {boolean}
 */
function itemDeletable(item) {
  if (!item.transactionCurrency || !item.payCurrency) {
    //不是汇率设置
    return false;
  }

  //除了USD CNY，其他自定义的汇率在禁用的状态可以删除
  if ((item.transactionCurrency !== 'USD' || item.payCurrency !== 'CNY') && !item.status) {
    return true;
  }

  return false;
}

export default class List extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visibleEdit: false,
      editData: {},
      isConfig: false
    };
  }

  changeDetault = item => value => {
    const { doSomeOperation, plat, getPlatSetting, showTopAlert } = this.props;
    let params = {};
    const { sortType } = this.props;
    if (value) {
      params = {
        currency: `${item.transactionCurrency}${item.payCurrency}`,
        type: sortType
      };
      doSomeOperation(plat, 'default', params).then(res => {
        if (res.result) {
          showTopAlert({
            style: 'success',
            content: i18n['general.set_success']
          });
          getPlatSetting(plat);
        }
      });
    }
  };
  updatePayPlatSetting = item => () => {
    const { updatePayPlat, plat } = this.props;
    const params = Object.assign({}, item, { enable: !item.enable });
    return updatePayPlat(plat, params);
  };
  rateSettingStatus = (item, status) => () => {
    const { doSomeOperation, plat, sortType } = this.props;
    const params = {
      currency: `${item.payCurrency}${item.transactionCurrency}`,
      type: sortType,
      status: status
    };
    return doSomeOperation(plat, 'status', params);
  };
  confirmChangeStatus = (item, status) => {
    const { showTipsModal, getPlatSetting, plat, type, showTopAlert } = this.props;
    showTipsModal({
      header: i18n['common.tips.risk'],
      content: i18n['general.confirm.tips'],
      onConfirm: cb => {
        let submit = null;
        switch (type) {
          case 'rate':
            submit = this.rateSettingStatus(item, status);
            break;
          case 'payPlat':
            submit = this.updatePayPlatSetting(item);
            break;
        }
        submit().then(res => {
          if (res.result) {
            showTopAlert({
              style: 'success',
              content: i18n['general.operate_success']
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

  confirmDelete = item => {
    const { showTipsModal, showTopAlert, getPlatSetting } = this.props;

    showTipsModal({
      header: i18n['common.tips.risk'],
      content: i18n['general.confirm.tips'],
      onConfirm: cb => {
        const { plat, deleteRateSetting, sortType } = this.props;

        deleteRateSetting(plat, sortType, item).then(res => {
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

  renderHeader = () => {
    const { versionRights, columns } = this.props;
    return columns
      .filter(el => {
        if (el.right) {
          return versionRights[el.right];
        }
        return true;
      })
      .map(col => {
        let content = i18n[`trader.plat.setting.deposit.rate_setting.table_header.${col.key}`];
        if (['sort', 'operation'].includes(col.key)) {
          content = i18n[`general.${col.key}`];
        }
        return (
          <th key={col.key} title={content}>
            {content}
          </th>
        );
      });
  };
  renderCell = (item, key) => {
    const { defaultCurrencyPair, columns, versionRights, plat } = this.props;
    return (
      <tr key={`${item.payTransactionCurrency ? item.payTransactionCurrency : item.providerId}`}>
        {columns
          .filter(el => {
            if (el.right) {
              return versionRights[el.right];
            }
            return true;
          })
          .map(col => {
            let content = '';
            switch (col.key) {
              case 'sort':
                content = <i className="fa fa-bars" />;
                break;
              case 'exchangeMode':
                if (item[col.key] === 'Manual') {
                  content = i18n['platform.tab.deposit.exchange.manual'];
                } else if (item[col.key] === 'Automatic') {
                  content = i18n['platform.tab.deposit.exchange.auto'];
                }
                break;
              case 'exchangeSource':
                if (
                  item.exchangeMode !== 'Manual' &&
                  item.payCurrency === 'CNY' &&
                  item.transactionCurrency === 'USD'
                ) {
                  if (item.exchangeSource === 'BankDiscountPrice') {
                    content = i18n['platform.tab.exchange.source.bank.discount'];
                  }
                  if (item.exchangeSource === 'CashPurchasePrice') {
                    content = i18n['platform.tab.exchange.source.cash.purchase'];
                  } else {
                    content = i18n['platform.tab.exchange.source.cash.sale'];
                  }
                } else {
                  content = '--';
                }
                break;
              case 'showCharge':
              case 'showExchange':
                if (item[col.key]) {
                  content = <i className="fa fa-check" />;
                } else {
                  content = <i className="fa fa-times" />;
                }
                break;
              case 'defaultCurrencyPair':
                item.defaultCurrencyPair =
                  defaultCurrencyPair === `${item.transactionCurrency}${item.payCurrency}` ? true : false;
                content = item.status ? (
                  <Radio
                    className={cs.default_rate_radio}
                    onChange={this.changeDetault(item)}
                    checked={item['defaultCurrencyPair']}
                  />
                ) : null;
                break;
              case 'enable':
              case 'status':
                content = item[col.key] ? (
                  <span className={cs.green}>{i18n['common.tips.enable']}</span>
                ) : (
                  <span className={cs.red}>{i18n['common.tips.disable']}</span>
                );
                break;

              case 'providerName':
                content = item.name !== item.providerName ? `${item.providerName}(${item.name})` : item.providerName;
                break;
              case 'users':
                content = item.accountGroups.map(el => el.name).join('、');
                break;
              case 'operation':
                content = (
                  <div>
                    {/* <a onClick={this.openEditModal.bind(this, item)}>{i18n['general.edit']}</a> */}
                    <Button style="primary" className="icon" onClick={this.openEditModal.bind(this, item)}>
                      <i className="fa fa-pencil" />
                    </Button>
                    {`${item.transactionCurrency}${item.payCurrency}` !== defaultCurrencyPair ? (
                      item.status || item.enable ? (
                        // <a onClick={this.confirmChangeStatus.bind(this, item, '0')}>{i18n['general.disabled']}</a>
                        <Button className="icon" onClick={this.confirmChangeStatus.bind(this, item, '0')}>
                          <i className="fa fa-ban" />
                        </Button>
                      ) : (
                        // <a onClick={this.confirmChangeStatus.bind(this, item, '1')}>{i18n['common.tips.enable']}</a>
                        <Button
                          style="primary"
                          className="icon"
                          onClick={this.confirmChangeStatus.bind(this, item, '1')}
                        >
                          <i className="fa fa-check-circle" />
                        </Button>
                      )
                    ) : null}
                    {this.props.type === 'payPlat' && this.props.versionRights['SC_DEPOSIT_FOR_GROUP'] && (
                      <Button style="primary" className="icon" onClick={this.config.bind(this, item)}>
                        <i className="fa fa-cog" />
                      </Button>
                    )}

                    {itemDeletable(item) && (
                      <Button style="primary" className="icon" onClick={this.confirmDelete.bind(this, item)}>
                        <i className="fa fa-trash" />
                      </Button>
                    )}
                  </div>
                );
                break;
              case 'exchangeFloat':
                content = item[col.key] || 0;
                break;
              case 'notice':
                if (plat === 'CTRADER') {
                  content = item[col.key];
                } else {
                  const lang = language.getLang();
                  content = item['notices'] ? item['notices'][lang] : '';
                }

                break;
              default:
                content = item[col.key];
            }
            return (
              <td key={col.key} title={content}>
                {content}
              </td>
            );
          })}
      </tr>
    );
  };
  renderTableBody = data => {
    return data.map((item, key) => this.renderCell(item, key));
  };
  arrTans(arr, oldIndex, newIndex) {
    const oldId = arr[oldIndex];
    arr.splice(oldIndex, 1);
    arr.splice(newIndex, 0, oldId);
    return arr;
  }
  onSort = evt => {
    const { data, plat, getPlatSetting, platSettingSort, sortType } = this.props;
    const { oldIndex, newIndex } = evt;
    const copyed = _.cloneDeep(data);
    const end = this.arrTans(copyed, oldIndex, newIndex);
    if (oldIndex !== newIndex) {
      platSettingSort(plat, sortType, end).then(res => {
        if (res.result) {
          getPlatSetting(plat);
        }
      });
    }
  };
  isEditVisible = value => {
    this.setState({
      visibleEdit: value
    });
  };
  openEditModal = item => {
    this.setState({
      editData: item
    });
    this.isEditVisible(true);
  };
  config = item => {
    this.setState({
      isConfig: true,
      chooseGroups: item.accountGroups
    });
    this.currentId = item.providerId;
  };
  closeConfig = () => {
    this.setState({
      isConfig: false
    });
  };
  saveConfig = data => {
    data = data.map(el => {
      let obj = {};
      obj.key = el.id;
      obj.name = el.groupName;
      return obj;
    });
    this.props
      .saveAccountConfig(this.props.plat, {
        providerId: this.currentId,
        accountGroups: data
      })
      .then(rs => {
        if (rs.result) {
          this.closeConfig();
          this.props.getPlatSetting(this.props.plat);
        }
      });
  };
  render() {
    const {
      data,
      heightLimit,
      type,
      sortType,
      submitForm,
      updateRateSetting,
      updatePayPlat,
      getPlatSetting,
      plat,
      showTopAlert,
      columns,
      accountGroups,
      versionRights
    } = this.props;
    const { visibleEdit, editData, isConfig, chooseGroups } = this.state;
    console.log('chooseGroups', chooseGroups, accountGroups);

    return (
      <div className={heightLimit ? cs.list_container : ''}>
        <Table>
          <Table.Header
            fixHeader={true}
            data={columns.filter(el => {
              if (el.right) {
                return versionRights[el.right];
              }
              return true;
            })}
          >
            {this.renderHeader()}
          </Table.Header>
          <Table.Body
            sortable
            onSort={this.onSort}
            data={columns.filter(el => {
              if (el.right) {
                return versionRights[el.right];
              }
              return true;
            })}
          >
            {this.renderTableBody(data)}
          </Table.Body>
        </Table>
        {visibleEdit ? (
          <EditModal
            sortType={sortType}
            editData={editData}
            onClose={this.isEditVisible.bind(this, false)}
            type={type}
            submitForm={submitForm}
            updateRateSetting={updateRateSetting}
            updatePayPlat={updatePayPlat}
            getPlatSetting={getPlatSetting}
            plat={plat}
            showTopAlert={showTopAlert}
          />
        ) : null}
        {isConfig && (
          <AccountGroups
            showTopAlert={showTopAlert}
            onClose={this.closeConfig}
            chooseGroups={chooseGroups}
            accountGroups={accountGroups}
            saveConfig={this.saveConfig}
          />
        )}
      </div>
    );
  }
}
