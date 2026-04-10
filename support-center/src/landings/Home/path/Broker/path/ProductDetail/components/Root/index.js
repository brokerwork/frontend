import ContentWrapper from 'components/ContentWrapper';
import Panel from 'components/Panel';
import i18n from 'utils/i18n';
import moment from 'moment';
import Button from 'components/Button';
import ProgressBar from 'components/ProgressBar';
import _ from 'lodash';
import { getTenantId, getTenantInfo } from 'utils/tenantInfo';
import { getUserInfo } from 'utils/userInfo';
const dateTimeFormatStyle = 'YYYY-MM-DD HH:MM';
import language from 'utils/language';
import Dropdown from 'components/Dropdown';
import { getToken } from 'utils/userInfo';
import FormControl from 'components/FormControl';
import Modal from 'components/Modal';
import cs from './style.less';

export default class Root extends PureComponent {
  state = {
    dataReady: false,
    code: '',
    codeModal: false,
    exportFlag: ''
  };
  componentDidMount() {
    const { getProductDetail, getProductLimit, rightFunction } = this.props;
    const tenantId = getTenantId();
    Promise.all([getProductDetail(), getProductLimit(tenantId), rightFunction()]).then(() =>
      this.setState({
        dataReady: true
      })
    );
  }
  unlock = () => {
    const { unlockUser, productDetail, getProductDetail } = this.props;
    const { tenantEmail } = getTenantInfo();
    const pubUserId = _.get(productDetail, 'bwAdmin.pubUserId');
    unlockUser(pubUserId, tenantEmail).then(() => {
      getProductDetail();
    });
  };
  resetToken = () => {
    const { resetToken, getProductDetail, showTipsModal } = this.props;
    showTipsModal({
      content: i18n['trader.detail.reset.token.tips'],
      onConfirm: cb => {
        resetToken().then(() => getProductDetail());
        cb();
      }
    });
  };
  onChange = e => {
    this.setState({
      code: e.target.value
    });
  };
  export = flag => {
    const { sendCode } = this.props;
    // 设置发送验证码后 30分钟内不再发送
    const sendTime = localStorage.getItem('SEND_CODE_TIME');
    if (sendTime) {
      // 判断发送时间是否超过30min
      if (Date.now() - sendTime > 30 * 60 * 1000) {
        sendCode('download').then(res => {
          if (res.result) {
            localStorage.setItem('SEND_CODE_TIME', Date.now());
          }
        });
      }
    } else {
      sendCode('download').then(res => {
        if (res.result) {
          localStorage.setItem('SEND_CODE_TIME', Date.now());
        }
      });
    }
    this.setState({
      codeModal: true,
      exportFlag: flag
    });
  };
  onVeri = () => {
    const { showTopAlert, clearData } = this.props;
    const { code, exportFlag } = this.state;
    if (!code) {
      showTopAlert({
        content: i18n['OW_SC_00004']
      });
      return;
    }
    // 倒出数据
    if (exportFlag) {
      const requestUrl = `${location.origin}/v1/system/data/download/${exportFlag}`;
      const token = getToken();
      window.open(`${requestUrl}?verificationCode=${code}&token=${token}`, '_blank');
    } else {
      // 没有导出数据flag就是删除数据
      clearData(code).then(({ result }) => {
        if (result) {
          showTopAlert({
            style: 'success',
            content: i18n['broker.product_detail.delete_all']
          });
        }
      });
    }
  };
  showExportComment = () => {
    const { showTipsModal } = this.props;
    showTipsModal({
      content: (
        <div>
          <h4>{i18n['dashboard.export_service.warn1']}</h4>
          <p style={{ color: '#1fb5ad' }}>{i18n['dashboard.export_service.warn2']}</p>
          <h4>{i18n['dashboard.export_service.warn3']}</h4>
          <p>{i18n['dashboard.export_service.warn4']}</p>
          <p>{i18n['dashboard.export_service.warn5']}</p>
          <p>{i18n['dashboard.export_service.warn6']}</p>
          <p>{i18n['dashboard.export_service.warn7']}</p>
          <p>{i18n['dashboard.export_service.warn8']}</p>
          <h4>{i18n['dashboard.data_service.warn3']}</h4>
          <p>{i18n['dashboard.export_service.warn9']}</p>
          <p>{i18n['dashboard.export_service.warn10']}</p>
        </div>
      )
    });
  };
  showDeleteComment = () => {
    const { showTipsModal, sendCode } = this.props;
    showTipsModal({
      content: (
        <div>
          <h4>{i18n['dashboard.data_service.warn1']}</h4>
          <p>{i18n['dashboard.data_service.warn2']}</p>
          <h4>{i18n['dashboard.data_service.warn3']}</h4>
          <p>{i18n['dashboard.data_service.warn4']}</p>
          <p>{i18n['dashboard.data_service.warn5']}</p>
        </div>
      ),
      onConfirm: cb => {
        sendCode('clear');
        this.setState({
          codeModal: true,
          exportFlag: ''
        });
        cb();
      }
    });
  };
  mtGroup = detail => {
    // 交易服务器
    let mt4Live = 0,
      mt5Live = 0;
    let mt4Simulator = 0,
      mt5Simulator = 0;
    let mtgroup = {};
    _.forEach(detail.vendors, vendor => {
      if (vendor.vendor === 'MT4') {
        if (vendor.type === 'real') {
          mt4Live = mt4Live + 1;
        } else {
          mt4Simulator = mt4Simulator + 1;
        }
      } else if (vendor.vendor === 'MT5') {
        if (vendor.type === 'real') {
          mt5Live = mt5Live + 1;
        } else {
          mt5Simulator = mt5Simulator + 1;
        }
      }
    });
    detail.vendorNum = mt4Live + mt5Live;
    let curLang = language.getLang() || 'zh-CN';
    if (mt4Live > 0) {
      mtgroup.mt4 =
        curLang === 'zh-CN'
          ? `MT4：Demo ${mt4Simulator} 台，Live ${mt4Live} 台`
          : `MT4：${mt4Simulator} Demo Server，${mt4Live} Live Server`;
    }
    if (mt5Live > 0) {
      mtgroup.mt5 =
        curLang === 'zh-CN'
          ? `MT5：Demo ${mt5Simulator} 台，Live ${mt5Live} 台`
          : `MT5：${mt5Simulator} Demo Server，${mt5Live} Live Server`;
    }
    return mtgroup;
  };
  cancelAuth = () => {
    const { cancelAuth, productDetail, showTipsModal, getProductDetail } = this.props;
    const { userId } = getUserInfo();
    showTipsModal({
      header: i18n['broker.detail.double_auth.admin_cancel.title'],
      content: i18n['broker.detail.double_auth.admin_cancel.content'],
      onConfirm: cb => {
        cancelAuth(productDetail.bwAdmin.pubUserId).then(() => {
          getProductDetail();
        });
        cb();
      }
    });
  };
  render() {
    const { productDetail, productLimit, cancelAuth, brokerRights } = this.props;
    const { dataReady, codeModal, code } = this.state;
    const vModules = _.get(productDetail, 'version.modules', []);
    const isOpenedAPI = _.some(vModules, { moduleCode: 'BWAPI' });
    const mtgroup = this.mtGroup(productDetail);
    return (
      <ContentWrapper header={i18n['broker.product_detail.title']}>
        {dataReady ? (
          <div className={cs['content']}>
            <Panel header={i18n['product.detail.base.title']} className={cs['product-detail']}>
              <ul>
                <li>
                  <label>{i18n['product.detail.access.url']}：</label>
                  <span>
                    <a href={`//${productDetail.productDomain}`} target="_blank">
                      {productDetail.productDomain}
                    </a>{' '}
                    （{i18n['product.detail.default']}）
                  </span>
                  {productDetail.customerDomain ? (
                    <span>
                      <a href={`//${productDetail.customerDomain}`} target="_blank">
                        {productDetail.customerDomain}
                      </a>{' '}
                      （{i18n['product.detail.customer']}）
                    </span>
                  ) : null}
                </li>
                <li>
                  <label>{i18n['product.detail.version']}：</label>
                  {productDetail.versionName}
                </li>
                <li>
                  <label>{i18n['product.detail.modules']}：</label>
                  {productDetail.modules}
                </li>
                <li>
                  <label>{i18n['product.detail.user.limited']}：</label>
                  {productDetail.version.numLimited}
                </li>
                <li>
                  <label>{i18n['product.detail.vendor.used']}：</label>
                  {productDetail.vendorNum}; {mtgroup.mt4 ? mtgroup.mt4 : null};{mtgroup.mt5 ? mtgroup.mt5 : null}
                </li>
                <li>
                  <label>{i18n['product.detail.create.time']}：</label>
                  {moment(productDetail.started).format(dateTimeFormatStyle)}
                </li>
                <li>
                  <label>{i18n['product.detail.exipred.time']}：</label>
                  {moment(productDetail.expired).format(dateTimeFormatStyle)}
                </li>
                <li>
                  <label>{i18n['product.detail.admin.user']}：</label>
                  {productDetail.bwAdmin.name}
                  {productDetail.bwAdmin.userStatus ? (
                    <span>
                      {'('}
                      <span style={{ color: 'green' }}>{i18n['product.detail.status.normal']}</span>
                      {')'}
                    </span>
                  ) : (
                    <span>
                      <span style={{ color: 'red', fontWeight: '700' }}>{i18n['product.detail.status.lock']}</span>，
                      {i18n['product.detail.unlock.first']}
                      <a href="javascript:;" onClick={this.unlock}>
                        {i18n['product.detail.unlock.action']}
                      </a>{' '}
                      {i18n['product.detail.unlock.last']}
                    </span>
                  )}
                </li>
                {brokerRights.includes('SC_SECURITY_SET') ? (
                  <li>
                    <label>{i18n['broker.product_detail.double_auth']}：</label>
                    {productDetail.bwAdmin.twoFaStatus ? (
                      <span>
                        {i18n['broker.detail.double_auth.open']}
                        <a href="javacript:;" onClick={this.cancelAuth}>
                          {i18n['general.cancel']}
                        </a>
                      </span>
                    ) : (
                      <span>{i18n['broker.detail.double_auth.close']}</span>
                    )}
                  </li>
                ) : null}
                <li>
                  <label>{i18n['product.detail.exipred.time']}：</label>
                  {moment(productDetail.expired).format(dateTimeFormatStyle)}
                </li>
                {isOpenedAPI ? (
                  <li className={cs['api_key_item']}>
                    <label style={{ fontWeight: '400' }}>API KEY：</label>
                    {productDetail.token}
                    <Button style="primary" onClick={this.resetToken}>
                      {i18n['product.detail.btn.reset']}
                    </Button>
                  </li>
                ) : null}
                <li className={cs['export']}>
                  {!productDetail.invalidTenant ? (
                    <Dropdown>
                      <Dropdown.Toggle>
                        <Button style="primary">{i18n['dashboard.export_service.title']}</Button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Button onClick={this.export.bind(this, 'user')}>
                          {i18n['dashboard.export_service.user']}
                        </Button>
                        <Button onClick={this.export.bind(this, 'customer')}>
                          {i18n['dashboard.export_service.customer']}
                        </Button>
                        <Button onClick={this.export.bind(this, 'accountOwner')}>
                          {i18n['dashboard.export_service.account.owner']}
                        </Button>
                        <Button onClick={this.export.bind(this, 'customerAccount')}>
                          {i18n['dashboard.export_service.customer.account']}
                        </Button>
                        <Button onClick={this.export.bind(this, 'accountUserRalation')}>
                          {i18n['dashboard.export_service.account.user.ralation']}
                        </Button>
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : null}
                  <a href="javascript:;" onClick={this.showExportComment}>
                    {i18n['field.setting.agent.edit.comment']}
                  </a>
                  {' | '}
                  <a href="javascript:;" onClick={this.showDeleteComment}>
                    {i18n['dashboard.data_service.title']}
                  </a>
                </li>
              </ul>
            </Panel>
            <Panel header={`${i18n['product.detail.user.total']} ${productDetail.userNum}/${productLimit.userLimited}`}>
              <ProgressBar now={(productDetail.userNum / productLimit.userLimited) * 100} />
            </Panel>
          </div>
        ) : null}
        {codeModal ? (
          <Modal
            onClose={() =>
              this.setState({
                codeModal: false
              })
            }
          >
            <Modal.Header>{i18n['eneral.tips']}</Modal.Header>
            <Modal.Body>
              <h4>{i18n['dashboard.data_service.warn6']}</h4>
              <FormControl value={code} onChange={this.onChange} />
            </Modal.Body>
            <Modal.Footer>
              <Button style="primary" onClick={this.onVeri}>
                {i18n['app.btn.confirm']}
              </Button>
              <Button
                onClick={() =>
                  this.setState({
                    codeModal: false
                  })
                }
              >
                {i18n['app.btn.cancel']}
              </Button>
            </Modal.Footer>
          </Modal>
        ) : null}
      </ContentWrapper>
    );
  }
}
