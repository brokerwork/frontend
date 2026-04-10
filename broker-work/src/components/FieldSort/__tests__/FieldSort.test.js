import { shallow } from 'enzyme';
import FieldSort from '../index.js';

describe('排序 Component', () => {
  const wrap = shallow(<FieldSort onHide={fn} title={'测试的排序'} />);
  wrap.setState({
    hideField: [],
    value: [],
    selectedHideField: [],
    selectedValue: [],
    selectedShowAll: false,
    selectedHideAll: false
  });
  it('必须有左边的隐藏区域', () => {
    expect(wrap.find('#sortLeft').exists()).toBe(true);
  });
  it('必须有右边的显示区域', () => {
    expect(wrap.find('#sortRight').exists()).toBe(true);
  });
  it('必须有中间的按钮区域', () => {
    expect(wrap.find('#sortMiddle').exists()).toBe(true);
  });
});

function fn() {}
