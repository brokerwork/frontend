import { shallow } from 'enzyme';
import ImportExcel from '../index.js';

function fn() {}

describe('批量入金 导入组件', () => {
  const wrap = shallow(<ImportExcel onChange={fn} />);

  describe('当fail为true时，展示错误信息', () => {
    beforeEach(() => {
      wrap.setState({ fail: true });
    });

    it('展示错误信息', () => {
      expect(wrap.find('[data-test="error-tips"]').exists()).toBe(true);
    });
  });

  describe('当fileName不为空时，展示文件', () => {
    beforeEach(() => {
      wrap.setState({ fileName: 'test.xlsx' });
    });

    it('展示文件', () => {
      expect(wrap.find('[data-test="file-name"]').exists()).toBe(true);
    });
  });
});
