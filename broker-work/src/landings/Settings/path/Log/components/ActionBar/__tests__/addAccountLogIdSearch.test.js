import { shallow } from 'enzyme';
import ActionBar from '../index.js';
import { DropdownForCode } from 'components/Dropdown';

describe('账户模块操作日志通过对象ID搜索功能', () => {
  const wrap = shallow(
    <ActionBar module="ACCOUNT" params={{ fuzzyItem: [] }} />
  );
  it('当传入的module为Accout时模糊搜索条件必须有对象ID', () => {
    expect(
      wrap
        .find('DropdownForCode')
        .at(1)
        .props().data[2].value
    ).toEqual('objectId');
  });
});
