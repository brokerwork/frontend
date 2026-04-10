import { shallow } from 'enzyme';
import { ExtrasTotalInfoComponent } from '../index';

describe('任务列表总量显示', () => {
  const wrap = shallow(<ExtrasTotalInfoComponent total={5} jobType={''} />);
  describe('当为入金任务时', () => {
    beforeEach(() => {
      wrap.setProps({
        jobType: 'JOB_TYPE_TA_DEPOSIT'
      });
      wrap.update();
    });
    it('显示总量', () => {
      expect(wrap.find('[data-test="extras-tr"]').exists()).toBe(true);
    });
  });

  describe('当为出金任务时', () => {
    beforeEach(() => {
      wrap.setProps({
        jobType: 'JOB_TYPE_TA_WITHDRAW'
      });
      wrap.update();
    });
    it('显示总量', () => {
      expect(wrap.find('[data-test="extras-tr"]').exists()).toBe(true);
    });
  });

  describe('当为代理出金任务时', () => {
    beforeEach(() => {
      wrap.setProps({
        jobType: 'JOB_TYPE_AGENCY_WITHDRAW'
      });
      wrap.update();
    });
    it('显示总量', () => {
      expect(wrap.find('[data-test="extras-tr"]').exists()).toBe(true);
    });
  });

  describe('当为其他任务时', () => {
    beforeEach(() => {
      wrap.setProps({
        jobType: 'JOB_TYPE_TA_OPEN'
      });
      wrap.update();
    });
    it('不显示总量', () => {
      expect(wrap.find('[data-test="extras-tr"]').exists()).toBe(false);
    });
  });
});
