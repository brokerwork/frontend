import BasicInfoForm from './InfoForm';
import { reduxForm, formValueSelector } from 'redux-form';
import cs from './index.less';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import { connect } from 'react-redux';
import Panel from 'components/Panel';
import Table from 'components/Table';

export const BASICINFO_FORM = 'TRADER_PLAT_SETTING_BASICINFO_FORM';

let TraderBasicInfoForm = reduxForm({
  form: BASICINFO_FORM,
  enableReinitialize: true
})(BasicInfoForm);

const selector = formValueSelector(BASICINFO_FORM); // <-- same as form name

TraderBasicInfoForm = connect(
  state => {
    const allowSameAccount = selector(state, 'allowSameAccount');
    const allowRealAccount = selector(state, 'allowRealAccount');
    return {
      allowSameAccount,
      allowRealAccount
    };
  },
  {}
)(TraderBasicInfoForm);

export default class BasicForm extends PureComponent {
  onSubmit = values => {
    const { savePlatSetting, plat, type, productId, showTopAlert, getPlatSetting } = this.props;
    let copyData = _.cloneDeep(values);
    copyData.productId = productId;
    savePlatSetting(plat, type, copyData).then(res => {
      if (res.result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.save_success']
        });
        getPlatSetting(plat);
      }
    });
  };
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(BASICINFO_FORM);
  };
  onReset = () => {
    this.props.reset(BASICINFO_FORM);
  };
  setSync = (type, plat, id) => {
    this.props.showTipsModal({
      header: i18n['common.tips.risk'],
      content:
        type === 'enable'
          ? id === 'login'
            ? i18n['trader.plat.setting.basicInfo.set_sync_tip_rake'] //同步返佣账号单独提示
            : i18n['trader.plat.setting.basicInfo.set_sync_tip']
          : i18n['trader.plat.setting.basicInfo.forbid_sync_tip'],
      onConfirm: cb => {
        this.props.operateSync(type, plat, id).then(rs => {
          if (rs.result) {
            this.props.showTopAlert({
              style: 'success',
              content: i18n['general.save_success']
            });
            this.props.getPlatSetting(plat);
            cb();
          }
        });
      },
      onCancel: cb => {
        cb();
      }
    });
  };
  render() {
    const { basicSetting, leverageList, plat, versionRights = {} } = this.props;
    return (
      <div>
        {basicSetting ? (
          <TraderBasicInfoForm
            initialValues={basicSetting}
            leverageList={leverageList}
            onSubmit={this.onSubmit}
            plat={plat}
          />
        ) : null}
        {basicSetting && plat !== 'CTRADER' && versionRights['SC_SENSITIVE_SYN'] && (
          <Panel className={''} header={i18n['trader.plat.setting.basicInfo.mt_settting']}>
            <Table>
              <Table.Header>
                <th>{i18n['trader.plat.setting.basicInfo.system_field']}</th>
                <th>{i18n['trader.plat.setting.basicInfo.mt_field']}</th>
                <th>{i18n['bridge.connector.status']}</th>
                <th>{i18n['customer.bill.invoice.action']}</th>
              </Table.Header>
              <Table.Body>
                {basicSetting.fields.map((el, index) => {
                  return (
                    <tr key={index}>
                      <td>{el.fieldName}</td>
                      <td>{i18n[`trader.plat.setting.basicInfo.field_${el.fieldId}`]}</td>
                      <td>
                        {el.sync
                          ? i18n['trader.plat.setting.basicInfo.sync']
                          : i18n['trader.plat.setting.basicInfo.forbid_sync']}
                      </td>
                      <td>
                        {el.sync && (
                          <Button
                            title={i18n['trader.plat.setting.basicInfo.forbid_sync']}
                            className="icon"
                            onClick={this.setSync.bind(this, 'disable', plat, el.fieldId)}
                          >
                            <i className="fa fa-ban" />
                          </Button>
                        )}
                        {!el.sync && (
                          <Button
                            title={i18n['trader.plat.setting.basicInfo.set_sync']}
                            style="primary"
                            className="icon"
                            onClick={this.setSync.bind(this, 'enable', plat, el.fieldId)}
                          >
                            <i className="fa fa-check-circle" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </Table.Body>
            </Table>
          </Panel>
        )}
        <div className={cs.footer_button}>
          <Button style="primary" onClick={this.onSave}>
            {i18n['app.btn.save']}
          </Button>
          <Button onClick={this.onReset}> {i18n['app.btn.reset']}</Button>
        </div>
      </div>
    );
  }
}
