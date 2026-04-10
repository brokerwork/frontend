import { shallow } from 'enzyme';
import Footer from '../index.js';

describe('Footer组件增加帮助中心入口', () => {
  const wrap = shallow(
    <Footer brandInfo={{ showHelpCenter: true }} helpCenter={true} />
  );
  it('必须有帮助中心的跳转标签', () => {
    expect(wrap.find('[data-test="jumpHelpCenter"]').exists()).toBe(true);
  });
});
