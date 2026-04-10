import { shallow } from 'enzyme';
import SendObjects from '../index.js';
function fn() {}
function ajax() {
  return Promise.resolve({
    result: true,
    data: [{ name: '11', id: '1' }, { name: '01', id: '2' }]
  });
}
describe('设置 -> 通知中心 -> 发送对象', () => {
  const wrap = shallow(
    <SendObjects
      onChange={fn}
      getReceiverList={ajax}
      data={[{ name: '11', id: '1' }, { name: '01', id: '2' }]}
    />
  );
  it('SendObjects 正常渲染', () => {
    expect(wrap.find('[data-test="container"]').exists()).toBe(true);
  });
  it('SendObjects 输入', () => {
    const input = wrap.find('[data-test="input"]');
    input.simulate('change', {
      target: {
        value: 11
      }
    });
    return expect(
      ajax().then(() => wrap.state().searchOptions)
    ).resolves.toEqual([
      { name: '11', id: '1', checked: true },
      { name: '01', id: '2', checked: true }
    ]);
  });
  it('SendObjects 删除', () => {
    const item = wrap.find('[data-test="selectedOptions1"]');
    item.simulate('click');
    expect(wrap.state().selectedIds).toEqual(['2']);
    expect(wrap.state().selectedOptions).toEqual([{ name: '01', id: '2' }]);
    expect(wrap.state().searchOptions).toEqual([
      { name: '11', id: '1', checked: false },
      { name: '01', id: '2', checked: true }
    ]);
  });
  it('SendObjects check', () => {
    wrap.setState({
      showSearch: true
    });
    const item = wrap.find('[data-test="optionCheck1"]');
    item.simulate('change', { name: '11', id: '1' });
    wrap.update();
    expect(wrap.state().selectedIds).toEqual(['2', '1']);
    expect(wrap.state().selectedOptions).toEqual([
      { name: '01', id: '2' },
      { name: '11', id: '1' }
    ]);
    expect(wrap.state().searchOptions).toEqual([
      { name: '11', id: '1', checked: true },
      { name: '01', id: '2', checked: true }
    ]);
  });
});
