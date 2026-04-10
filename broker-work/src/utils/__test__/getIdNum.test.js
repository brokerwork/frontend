import getIdNum from '../getIdNum';

const fields = [
  {
    key: 'idType',
    optionList: [{ label: '身份证', value: '1' }, { label: '其他类型', value: '2' }]
  }
];
const idNum = '12345';
describe('根据值和自定义字段获取身份证号码', () => {
  it('当选择身份证时', () => {
    const result = getIdNum({ idNum, idType: '1' }, fields);
    expect(result).toEqual(idNum);
  });
  it('当选择的不是身份证时', () => {
    const result = getIdNum({ idNum, idType: '2' }, fields);
    expect(result).toEqual(undefined);
  });
});
