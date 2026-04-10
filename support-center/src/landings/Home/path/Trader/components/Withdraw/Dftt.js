import { reduxForm, Field } from 'redux-form';
import Table from 'components/Table';
import FormField from 'components/FormField';
import Button from 'components/Button';
import Form from 'components/Form';
import Modal from 'components/Modal';
import Checkbox from 'components/Checkbox';
import Select from 'components/Select';
import NumberInput from 'components/NumberInput';
import AccountGroups from '../AccountGroups';

import i18n from 'utils/i18n';
import language from 'utils/language';
import { connect } from 'react-redux';
import { getCustomFields, saveWithdraw, switchState, withdrawTypeSort } from '../../controls/actions.js';
import { showTipsModal, showTopAlert } from 'common/actions';
import Tab from 'components/Tab';
import cs from './style.less';
import _ from 'lodash';

class Dftt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      tpyeId: '',
      isCustom: false,
      visible: false,
      addVisible: false,
      fields: [],
      checkedMap: {},
      withdrawType: '',
      notice: '',
      activeKey: 'zh-CN',
      message: {},
      maxAmount: '',
      minAmount: '',
      isConfig: false
    };
    this.mapFieldName = {};
    props.getCustomFields().then(rs => {
      if (rs.result) {
        rs.data.forEach(el => {
          this.mapFieldName[el.fieldId] = el.message[language.getLang()];
        });
      }
    });
  }
  editors = {};
  componentDidMount() {
    this.props.onRef(this);
  }
  formatFieldText = fields => {
    return fields
      .map(el => {
        return i18n[`withdraw.types.fields.${el.fieldId}`] || this.mapFieldName[el.fieldId];
      })
      .join('、');
  };
  edit = (title, withdrawType, notice, fields, isCustom, typeId, message, maxAmount = '', minAmount = '') => {
    fields.forEach(el => {
      if (withdrawType === 'BANK_CARD') {
        if (el.fieldId === 'bankBranchName' || el.fieldId === 'swift' || el.fieldId === 'bankAddress') el.edit = true;
      }
    });
    this.setState({
      title,
      visible: true,
      fields,
      withdrawType,
      notice,
      isCustom,
      typeId,
      message,
      maxAmount,
      minAmount
    });
  };
  save = () => {
    let { notice, withdrawType = 'CUSTOMIZE', fields, message = {}, typeId, maxAmount, minAmount } = this.state;
    let { plat, reload, showTopAlert } = this.props;
    if (withdrawType === 'CUSTOMIZE') {
      if (!Object.keys(message).length) {
        showTopAlert({
          content: i18n['settings.update_notify.needInput'] + i18n['withdraw.types.name']
        });
        return;
      } else {
        let hasOne = Object.keys(message).some(el => {
          return message[el];
        });
        if (!hasOne) {
          showTopAlert({
            content: i18n['settings.update_notify.needInput'] + i18n['withdraw.types.name']
          });
          return;
        }
      }
    }
    if (plat !== 'CTRADER') {
      if (maxAmount && minAmount && Number(maxAmount) < Number(minAmount)) {
        showTopAlert({
          content: i18n['trader.plat.setting.withdraw.tips']
        });
        return;
      }
    }
    this.props
      .saveWithdraw(plat, {
        typeId,
        message,
        fields,
        notice,
        withdrawType,
        maxAmount,
        minAmount
      })
      .then(rs => {
        if (rs.result) {
          reload();
          this.setState({
            visible: false
          });
        }
      });
  };
  addField = () => {
    let checkedMap = {};
    _.cloneDeep(this.state.fields).forEach(el => {
      checkedMap[el.fieldId] = true;
    });
    this.setState({
      addVisible: true,
      checkedMap
    });
  };
  choose = (fieldId, fieldName, required, e) => {
    let checked = e.target.checked;
    let checkedMap = _.cloneDeep(this.state.checkedMap);
    checkedMap[fieldId] = checked;
    let fields = _.cloneDeep(this.state.fields);
    let field = {
      fieldId,
      required,
      fieldName
    };
    if (checked) {
      fields.push(field);
    } else {
      fields.splice(fields.indexOf(field), 1);
    }

    this.setState({
      checkedMap,
      fields
    });
  };
  changeNotice = e => {
    this.setState({
      notice: e.target.value
    });
  };
  toggleState = (currentState, withdrawType, tpyeId) => {
    let {
      showTipsModal,
      showTopAlert,
      switchState,
      plat,
      reload,
      data: { ways }
    } = this.props;
    if (currentState && ways.filter(el => el.enabled).length === 1) {
      showTopAlert({
        content: i18n['withdraw.types.limit']
      });
      return;
    }
    showTipsModal({
      content: currentState ? i18n['withdraw.types.tip_disable'] : i18n['withdraw.types.tip_enable'],
      onConfirm: cb => {
        switchState(currentState ? 'disable' : 'enable', plat, withdrawType, tpyeId).then(rs => {
          if (rs.result) {
            cb();
            reload();
          }
        });
      }
    });
  };
  changeRequired = (index, e) => {
    let value = e.target.value;
    let fields = _.cloneDeep(this.state.fields);
    fields[index].required = value === '1' ? true : false;
    this.setState({
      fields
    });
  };
  onChangeName = (type, e) => {
    const value = e.target.value;
    this.setState({
      message: {
        ...this.state.message,
        [type]: value
      }
    });
  };
  onChangeTab = value => {
    this.setState({
      activeKey: value
    });
  };
  renderHeader = () => {
    const { columns } = this.props;
    return [
      <th>{i18n['general.sort']}</th>,
      <th>{i18n['platform.tab.dftt.withdraw.type.title']}</th>,
      <th>{i18n['withdraw.types.fields']}</th>,
      <th>{i18n['platform.tab.withdraw.notice']}</th>,
      <th>{i18n['dashboard.product.status']}</th>,
      <th>{i18n['customer.bill.invoice.action']}</th>
    ];
  };
  renderTableBody = data => {
    return data.map((item, key) => this.renderCell(item, key));
  };
  onSort = evt => {
    const { data, plat, getPlatSetting, withdrawTypeSort } = this.props;
    const { oldIndex, newIndex } = evt;
    const copyed = _.cloneDeep(data.ways);
    const end = this.arrTans(copyed, oldIndex, newIndex);
    const ways = end.map(el => {
      return el.typeId ? el.typeId : el.withdrawType;
    });
    if (oldIndex !== newIndex) {
      withdrawTypeSort(plat, ways).then(res => {
        if (res.result) {
          getPlatSetting(plat);
        }
      });
    }
  };
  arrTans(arr, oldIndex, newIndex) {
    const oldId = arr.splice(oldIndex, 1)[0];
    arr.splice(newIndex, 0, oldId);
    return arr;
  }
  renderCell = (el, key) => {
    const { columns } = this.props;
    let label = i18n[`withdraw.types.${el.withdrawType}`];
    if (el.withdrawType === 'CUSTOMIZE') {
      label = el.message[language.getLang()] || i18n['withdraw.types.noname'];
    }
    return (
      <tr key={label + key}>
        <td>
          <i className="fa fa-bars" />
        </td>
        <td>{label}</td>
        <td>{this.formatFieldText(el.fields)}</td>
        <td style={{ cursor: 'default' }} title={el.notice}>
          {el.notice}
        </td>
        <td style={{ color: `${el.enabled ? 'green' : 'red'}` }}>
          {el.enabled ? i18n['common.tips.enable'] : i18n['common.tips.disable']}
        </td>
        <td>
          <Button
            style="primary"
            className="icon"
            onClick={this.edit.bind(
              this,
              i18n[`withdraw.types.${el.withdrawType}`],
              el.withdrawType,
              el.notice,
              el.fields,
              el.withdrawType === 'CUSTOMIZE',
              el.typeId,
              el.message,
              el.maxAmount,
              el.minAmount
            )}
          >
            <i className="fa fa-pencil" />
          </Button>
          <Button
            style={`${el.enabled ? 'default' : 'primary'}`}
            className="icon"
            onClick={this.toggleState.bind(this, el.enabled, el.withdrawType, el.typeId)}
          >
            <i className={`fa ${el.enabled ? 'fa-ban' : 'fa-check-circle'}`} />
          </Button>
          <Button style="primary" className="icon" onClick={this.config.bind(this, el, key)}>
            <i className="fa fa-cog" />
          </Button>
        </td>
      </tr>
    );
  };
  handleAmountChange = name => v => {
    this.setState({
      [name]: v
    });
  };
  config = (item, index) => {
    this.setState({
      isConfig: true,
      chooseGroups: item.accountGroups
    });
    this.currendIndex = index;
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
    const currentItem = this.props.data.ways.find((el, index) => index === this.currendIndex);
    this.props
      .saveWithdraw(this.props.plat, {
        ...currentItem,
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
      bankCard,
      data: { ways = [] },
      customFields,
      brandInfo: { languages = [] } = {},
      plat,
      accountGroups,
      showTopAlert
    } = this.props;
    console.log('accountGroups', accountGroups);
    const {
      title,
      visible,
      addVisible,
      fields,
      tempFields,
      notice,
      checkedMap,
      isCustom,
      maxAmount,
      minAmount,
      isConfig,
      chooseGroups
    } = this.state;
    const filterCustomFields = customFields.filter(el => el.enable);
    return (
      <div>
        <Table>
          <Table.Header fixHeader={true}>{this.renderHeader()}</Table.Header>
          <Table.Body sortable onSort={this.onSort}>
            {this.renderTableBody(ways)}
          </Table.Body>
        </Table>
        {visible && (
          <Modal
            onClose={() => {
              this.setState({ visible: false });
            }}
            className={cs.modal}
          >
            <Modal.Header>{title}</Modal.Header>
            <Modal.Body style={{ maxHeight: 500 }}>
              {isCustom && (
                <div className={cs['card']}>
                  {i18n['withdraw.types.name']}
                  <Tab activeKey={this.state.activeKey} onChange={this.onChangeTab}>
                    {languages.map(el => {
                      return (
                        <Tab.Panel title={el.label} eventKey={el.value} className={cs['tab']}>
                          <textarea
                            onChange={this.onChangeName.bind(this, el.value)}
                            value={this.state.message[el.value]}
                          />
                        </Tab.Panel>
                      );
                    })}
                  </Tab>
                </div>
              )}
              <div className={cs['card']}>
                {i18n['withdraw.types.formSetting']}
                <Button style="primary" onClick={this.addField}>
                  {i18n['field.setting.field.update.select']}
                </Button>
              </div>
              <Table className={cs['table']}>
                <Table.Header fixHeader>
                  <th>{i18n['field.setting.field.name']}</th>
                  <th>{i18n['field.setting.field.fieldType']}</th>
                  <th>{i18n['withdraw.types.required']}</th>
                  <th>{i18n['withdraw.types.fieldLimit']}</th>
                </Table.Header>
                <Table.Body>
                  {fields.map((el, index) => {
                    return (
                      <tr>
                        <td>{i18n[`withdraw.types.fields.${el.fieldId}`] || this.mapFieldName[el.fieldId]}</td>
                        <td>
                          {i18n[`withdraw.types.fields.${el.fieldId}`]
                            ? i18n['product.detail.default']
                            : i18n['field.setting.field-list.key']}
                        </td>
                        <td>
                          {!el.edit &&
                            (el.required ? i18n['field.setting.field.required'] : i18n['withdraw.types.required.no'])}
                          {el.edit && (
                            <select value={el.required ? '1' : '0'} onChange={this.changeRequired.bind(this, index)}>
                              <option value="1">{i18n['field.setting.field.required']}</option>
                              <option value="0">{i18n['withdraw.types.required.no']}</option>
                            </select>
                          )}
                        </td>
                        <td>{i18n['withdraw.types.fieldLimit.no']}</td>
                      </tr>
                    );
                  })}
                </Table.Body>
              </Table>
              <div className={cs['card']}>
                {i18n['withdraw.types.tip']}
                <textarea onChange={this.changeNotice} value={notice} />
              </div>
              {plat !== 'CTRADER' && (
                <div>
                  <div className={cs['card']}>
                    <label>{i18n['trader.plat.setting.withdraw.maxAmount']}</label>
                    <div className={cs['numberInput']}>
                      <NumberInput
                        decimal="{0,4}"
                        value={maxAmount}
                        onChange={this.handleAmountChange('maxAmount')}
                      ></NumberInput>
                    </div>
                  </div>
                  <div className={cs['card']}>
                    <label>{i18n['trader.plat.setting.withdraw.minAmount']}</label>
                    <div className={cs['numberInput']}>
                      <NumberInput
                        decimal="{0,4}"
                        value={minAmount}
                        onChange={this.handleAmountChange('minAmount')}
                      ></NumberInput>
                    </div>
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button style="primary" onClick={this.save}>
                {i18n['general.save']}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        {addVisible && (
          <Modal
            onClose={() => {
              this.setState({ addVisible: false });
            }}
          >
            <Modal.Header>{i18n['field.setting.field.update.select']}</Modal.Header>
            <Modal.Body>
              <Table className={cs['table']}>
                <Table.Header fixHeader>
                  <th>{i18n['withdraw.types.choose_no']}</th>
                  <th>{i18n['field.setting.field.name']}</th>
                  <th>{i18n['withdraw.types.required']}</th>
                  <th>{i18n['withdraw.types.fieldLimit']}</th>
                </Table.Header>
                <Table.Body>
                  {filterCustomFields.map(el => {
                    return (
                      <tr>
                        <td>
                          <input
                            type="checkbox"
                            onChange={this.choose.bind(this, el.fieldId, this.mapFieldName[el.fieldId], el.required)}
                            checked={checkedMap[el.fieldId]}
                          ></input>
                        </td>
                        <td>{this.mapFieldName[el.fieldId]}</td>
                        <td>
                          {el.required ? i18n['field.setting.field.required'] : i18n['withdraw.types.required.no']}
                        </td>
                        <td>{i18n['withdraw.types.fieldLimit.no']}</td>
                      </tr>
                    );
                  })}
                </Table.Body>
              </Table>
            </Modal.Body>
          </Modal>
        )}
        {isConfig && (
          <AccountGroups
            showTopAlert={showTopAlert}
            onClose={this.closeConfig}
            chooseGroups={chooseGroups}
            accountGroups={accountGroups}
            saveConfig={this.saveConfig}
            isWithdraw
          />
        )}
      </div>
    );
  }
}

export default connect(
  state => {
    return {
      customFields: state.traderCommon.customFields
    };
  },
  {
    getCustomFields,
    saveWithdraw,
    switchState,
    showTipsModal,
    showTopAlert,
    withdrawTypeSort
  }
)(Dftt);
