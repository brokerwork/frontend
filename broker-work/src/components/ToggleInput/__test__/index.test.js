import { shallow } from 'enzyme';

import ToggleInput from '../index';
import { FormControl } from 'react-bootstrap';
import NumberInput from 'components/NumberInput';

describe('toggleInput测试', () => {
  const wrap = shallow(<ToggleInput />);
  it('默认显示文本和编辑icon', () => {
    expect(wrap.find('[data-test="input-group"]').exists()).toBe(false);
    expect(wrap.find('[data-test="label-group"]').exists()).toBe(true);
    expect(wrap.find('[data-test="edit-icon"]').exists()).toBe(true);
  });
  describe('基本交互', () => {
    it('点击文本触发focus', () => {
      wrap.find('[data-test="label-group"]').simulate('click');
      expect(wrap.state()).toMatchObject({
        focus: true,
        foucsValue: wrap.state().inputValue
      });
    });
  });
  describe('disabled时', () => {
    beforeEach(() => {
      wrap.setProps({
        disabled: true
      });
      wrap.update();
    });
    it('不显示编辑icon', () => {
      expect(wrap.find('[data-test="edit-icon"]').exists()).toBe(false);
    });
  });
  describe('输入类型测试', () => {
    describe('input类型', () => {
      beforeEach(() => {
        wrap.setProps({
          inputType: 'input'
        });
        wrap.setState({ focus: true });
        wrap.update();
      });
      it('普通输入框', () => {
        expect(wrap.find(FormControl).exists()).toBe(true);
      });
    });
    describe('number类型', () => {
      beforeEach(() => {
        wrap.setProps({
          inputType: 'number'
        });
        wrap.setState({ focus: true });
        wrap.update();
      });
      it('Number输入框', () => {
        expect(wrap.find(NumberInput).exists()).toBe(true);
      });
    });
  });
});
