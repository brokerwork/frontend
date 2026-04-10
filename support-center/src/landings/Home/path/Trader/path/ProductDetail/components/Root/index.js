import Button from 'components/Button';
import ContentWrapper from 'components/ContentWrapper';
import i18n from 'utils/i18n';
import Panel from 'components/Panel';
import ProgressBar from 'components/ProgressBar';
import { getTenantId } from 'utils/tenantInfo';
import _ from 'lodash';
import cs from './style.less';
import moment from 'moment';
const dateTimeFormatStyle = 'YYYY-MM-DD HH:MM:SS';

class UpdateKey extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      publicKey: props.publicKey,
      err: ''
    };
  }
  onChange = e => {
    const { onChange } = this.props;
    const v = e.target.value;
    this.setState({
      publicKey: v,
      err: v ? '' : i18n['product.detail.public.key.update.error']
    });

    onChange(v);
  };
  render() {
    const { publicKey, err } = this.state;
    return (
      <div>
        <textarea className="form-control" rows="10" cols="20" value={publicKey} onChange={this.onChange} />
        {err ? <span style={{ color: 'red' }}>{err}</span> : null}
      </div>
    );
  }
}
export default class Root extends PureComponent {
  state = {
    dataReady: false,
    publicKey: ''
  };
  componentDidMount() {
    const { getProductDetail, getProductLimit } = this.props;
    const tenantId = getTenantId();
    Promise.all([getProductDetail(), getProductLimit(tenantId)]).then(() =>
      this.setState({
        dataReady: true
      })
    );
  }
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
  onKeyChange = val => {
    this.setState({
      publicKey: val
    });
  };
  updateKey = () => {
    const { upPublicKey, getProductDetail, showTipsModal, productDetail } = this.props;
    showTipsModal({
      header: i18n['product.detail.public.key.update.title'],
      content: <UpdateKey publicKey={productDetail.publicKey} onChange={this.onKeyChange} />,
      onConfirm: cb => {
        const { publicKey } = this.state;
        if (publicKey) {
          upPublicKey(publicKey).then(() => getProductDetail());
          cb();
        }
      }
    });
  };
  render() {
    const { dataReady } = this.state;
    const { productDetail, productLimit } = this.props;
    const vModules = _.get(productDetail, 'version.modules', []);
    const isOpenedAPI = _.some(vModules, { moduleCode: 'ACCOUNT_API' });
    const pkutime =
      productDetail.publicKeyUpdateTime > 0
        ? moment(productDetail.publicKeyUpdateTime).format(dateTimeFormatStyle)
        : '';
    return (
      <ContentWrapper header={i18n['trader.product_detail.title']}>
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
                  <label>{i18n['product.detail.create.time']}：</label>
                  {moment(productDetail.started).format(dateTimeFormatStyle)}
                </li>
                <li>
                  <label>{i18n['product.detail.exipred.time']}：</label>
                  {moment(productDetail.expired).format(dateTimeFormatStyle)}
                </li>
                {isOpenedAPI
                  ? [
                      <li>
                        <label>{i18n['dashboard.tenant.id']}：</label>
                        {productDetail.tenantId}
                      </li>,
                      <li>
                        <label style={{ fontWeight: '400' }}>API KEY：</label>
                        {productDetail.token}
                        <Button style="primary" onClick={this.resetToken}>
                          {i18n['product.detail.btn.reset']}
                        </Button>
                      </li>,
                      <li className={cs['update-public-key']}>
                        <div className={cs['text']}>
                          <label>
                            {i18n['product.detail.public.key.name']}
                            <span className={cs['info']} title={i18n['product.detail.public.key.tips']}>
                              i
                            </span>
                            ：
                          </label>
                          {i18n['product.detail.public.key.update.time']}
                          &nbsp;&nbsp;
                          {pkutime === '' ? i18n['product.detail.public.key.update.time.no'] : ` ${pkutime}`}
                        </div>

                        <Button style="primary" onClick={this.updateKey}>
                          {i18n['product.detail.public.key.update']}
                        </Button>
                      </li>
                    ]
                  : null}
              </ul>
            </Panel>
            <Panel header={`${i18n['product.detail.user.total']} ${productDetail.userNum}/${productLimit.userLimited}`}>
              <ProgressBar now={(productDetail.userNum / productLimit.userLimited) * 100} />
            </Panel>
          </div>
        ) : null}
      </ContentWrapper>
    );
  }
}
