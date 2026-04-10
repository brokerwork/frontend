import { shallow } from 'enzyme';
import Export from '../index.js';

describe('批量入今记录 导出组件', () => {
  const wrap = shallow(<Export depositId={'5a9e445e043afc7188c41e53'} />);

  describe('当show为true时，导出下拉选项才会展示', () => {
    beforeEach(() => {
      wrap.setState({ show: true });
    });

    it('展示导出下拉选项', () => {
      expect(wrap.find('[data-test="export-list"]').exists()).toBe(true);
    });
  });

  describe('onToggle展示下拉选项', () => {
    beforeEach(() => {
      wrap.instance().onToggle();
    });

    it('根据show值判断展示下拉选项', () => {
      expect(wrap.find('[data-test="export-list"]').exists()).toEqual(
        wrap.state('show')
      );
    });
  });
});
