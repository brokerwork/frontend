import { shallow } from 'enzyme';
import Root from '../index.js';

const brandInfo = {
  background: '1.jpg',
  companyAddress: '',
  companyEmail: 'support@lwork.com',
  companyName: '开发环境',
  companySite: 'http://www.lwork.com',
  customerDomain: 'broker.btmsc.lwork.com',
  customerDomainScheme: 'http://',
  inner: false,
  mode: 'MULTI_AGENT',
  productDomain: 'bwojffzn.btmsc.lwork.com',
  productIcon:
    'http://broker-upload-dev.oss-cn-hangzhou.aliyuncs.com/test/8224c5b0-be18-11e7-94f1-5751b0227c6a.png',
  productLogo:
    '//broker-upload.oss-cn-hangzhou.aliyuncs.com/test/f9927f06-a055-4edc-a110-dc641d75d103.jpg',
  pubKey:
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxq+EkcWV+gB/B81dqK+WJM1/0qgCS0uFodLv/uygtNTKf4mbHwfy/90SPILkpqkO31F3B5MYyLkl9MQFuA9DD95fcFOQFL7wEUnAtnGbzRbVCqo2JcUpyWV79LDeFlsL87NMvwtIGf5geEDLLPT7WS63X6o3LAaWrro3Z/rzf6zwKSWnzoMhjcrV6inmOkLGpOMQxwOgteaLmYvJ8x3BayokTGRDOH2JMMw49C9c5S2mwJ+axkAdi0ei83Y5K5WcCEbxeNaxZiDZs9HN428/QJtOtcXPtp0PyUH3449ycwBjYF+HHjxihvs/PzI/agPWVtE4hGba1Ldya5JMGh7KKQIDAQAB',
  releaseNotice: '',
  showPoweredBy: false,
  siteName: '开发环境-SUNNY',
  tenantId: 'T001117',
  tenantName: 'BROKER-开发环境啊',
  tenantType: 'normal',
  tpId: '58b405c049d8230a2ed8781a'
};

describe('登录页 Root', () => {
  const wrap = shallow(<Root getBrandInfo={fn} brandInfo={brandInfo} />);
  it('必须有账号输入框', () => {
    expect(wrap.find('[data-test="bg"]').prop('style').backgroundImage).toBe(
      'url(1.jpg)'
    );
  });
});

function fn() {}
