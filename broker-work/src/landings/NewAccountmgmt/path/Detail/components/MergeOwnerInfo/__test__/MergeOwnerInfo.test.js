import { shallow } from 'enzyme';
import MergeOwnerInfo from '../index.js';

const diffInfo = {
  accountId: '3005207',
  customerAccountId: ['2010521666'],
  diffResult: {
    appropriatenessTestInfo: [],
    baseInfo: [
      { field: 'accountName', value1: '1212mt新建账户', value2: 'yona测试归属' }
    ],
    certificatesInfo: [],
    classificationInfo: [],
    financialInfo: []
  }
};

const formColumns = {
  appropriatenessTestInfo: [],
  baseInfo: [
    {
      businessSelected: false,
      columns: '1',
      enable: true,
      fieldType: 'text',
      key: 'accountName',
      label: '姓名',
      longField: false,
      optionList: undefined,
      orderNo: 1,
      overuse: true,
      placeHolder: 'please input  the account name',
      readonly: false,
      searchable: false,
      sensitive: true,
      show: true,
      size: 40,
      sysDefault: true,
      unique: false,
      validateType: { required: true }
    }
  ],
  certificatesInfo: [],
  classificationInfo: [],
  financialInfo: []
};

describe('账户管理 合并账户所有人资料', () => {
  const wrap = shallow(
    <MergeOwnerInfo diffOwnerInfo={diffInfo} formColumns={formColumns} />
  );

  describe('展示含有不同值的信息', () => {
    it('只有存在不同信息的字段才会展示', () => {
      expect(wrap.find('[data-test="info"]').length).toBe(1);
    });
  });
});
