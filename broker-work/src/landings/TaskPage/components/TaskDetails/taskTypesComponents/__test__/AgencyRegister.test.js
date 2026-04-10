import { shallow } from 'enzyme';
import AgencyRegister from '../AgencyRegister';

describe('邮件重复提示', () => {
  const initialValues = {
    messageCode: undefined,
    openMessageCode: undefined,
    bindMessageCode: undefined,
    email: 'abcd@eee.com'
  };
  //   const isUserCreated = !messageCode && (openMessageCode || bindMessageCode);

  const wrap = shallow(<AgencyRegister initialValues={initialValues} />);
  wrap.setState({
    duplicateEmail: true
  });
  it('显示邮箱重复提示', () => {
    expect(wrap.find('[data-test="dumpemail-tip"]').exists()).toBe(true);
    expect(wrap.find('[data-test="create-tip"]').exists()).toBe(false);
  });
  describe('用户已经创建，但有开户或绑定账户错误', () => {
    const createdWrap = shallow(
      <AgencyRegister
        initialValues={{ ...initialValues, openMessageCode: true }}
      />
    );

    it('不显示邮箱重复提示', () => {
      expect(createdWrap.find('[data-test="dumpemail-tip"]').exists()).toBe(
        false
      );
      expect(createdWrap.find('[data-test="create-tip"]').exists()).toBe(true);
    });
  });
});
