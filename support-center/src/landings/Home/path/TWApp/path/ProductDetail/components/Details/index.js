import i18n from 'utils/i18n';
import cs from './Details.less';
import Form from 'components/Form';
import moment from 'moment';
import { dateTimeFormatStyle } from 'utils/config';
import ProgressBar from 'components/ProgressBar';
import Tips from 'components/Tips';


export default class Details extends PureComponent {
  _renderModules = (item, index) => {
    const {produceDetail} = this.props;
    return (index === (produceDetail.modules.length-1) ? item :`${item}, `);
  }
  _renderApplogo =() => {
    const {produceDetail} = this.props;
    const logo = produceDetail.appLogos.length > 0 && produceDetail.appLogos.find(item => item.px === '512*512');
    return (logo.url ? <img className={cs['logo-content']} src={logo.url}  /> : undefined);
  }
  render() {
    const {produceDetail, monthCharge} = this.props;
    return (
      <div className={cs['container']}>
        <div className={cs['left-part']}>
            <div className={cs['top-title']}>
              {i18n['twapp.product_detail.basic_info']}
            </div>
            <div className={cs['app-info-content']}>
              <div className={cs['basic-info']}>
                  <Form>
                    <Form.Item>
                    <Form.Label>
                     {i18n['twapp.product_detail.app_name']}：
                    </Form.Label>
                    <Form.Control>
                      <div className={cs['from-control']}>{produceDetail.appName}</div>
                    </Form.Control>
                  </Form.Item>
                  <Form.Item>
                    <Form.Label>
                      APP Logo：
                    </Form.Label>
                    <Form.Control>
                      <div className={cs['from-control']}>{this._renderApplogo()}</div>
                    </Form.Control>
                  </Form.Item>
                  <Form.Item>
                  <Form.Label>
                    {i18n['twapp.product_detail.app_version']}：
                  </Form.Label>
                  <Form.Control>
                    <div className={cs['from-control']}>{produceDetail.versionName}({produceDetail.versionId})</div>
                  </Form.Control>
                </Form.Item>
                <Form.Item>
                  <Form.Label>
                    {i18n['twapp.product_detail.app_function_modules']}：
                  </Form.Label>
                  <Form.Control>
                    <div className={cs['from-control']}>{produceDetail.modules &&
                      produceDetail.modules.map(this._renderModules)}</div>
                  </Form.Control>
                </Form.Item>
                <Form.Item>
                  <Form.Label>
                    {i18n['twapp.product_detail.basic_users']}：
                  </Form.Label>
                  <Form.Control>
                    <div className={cs['from-control']}>{produceDetail.numLimited}</div>
                  </Form.Control>
                </Form.Item>
                <Form.Item>
                  <Form.Label>
                  {i18n['twapp.product_detail.create_time']}：
                  </Form.Label>
                  <Form.Control>
                    <div className={cs['from-control']}>{moment(produceDetail.started).format(dateTimeFormatStyle)}</div>
                  </Form.Control>
                </Form.Item>
                  <Form.Item>
                    <Form.Label>
                    {i18n['twapp.product_detail.expired_time']}：
                    </Form.Label>
                    <Form.Control>
                      <div className={cs['from-control']}>{moment(produceDetail.expired).format(dateTimeFormatStyle)}</div>
                    </Form.Control>
                  </Form.Item>
                </Form>
              </div>
              <div className={cs['download-url']}>
                <div className={cs['download-label']}>{i18n['twapp.product_detail.download_url']}：</div>
                <img className={cs['qrcode-img']} src={produceDetail.qrdata} />
              </div>
          </div>
        </div>
        <div className={cs['right-part']}>
            <div className={cs['top-title']}>
              {i18n['twapp.product_detail.user_sum']}（{produceDetail.activeUserNum}/{produceDetail.userNum}）
            </div>
            <ProgressBar now={produceDetail.activeUserNum/produceDetail.userNum*100} className={cs['progress-bar']} />
        </div>
      </div>
    );
  }
}
