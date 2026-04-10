import { shallow } from 'enzyme';
import { RistWarning } from '../Transfer';

const normalIdentical = {
  jobType: 'JOB_TYPE_AGENCY_WITHDRAW',
  jobNo: '12445',
  currency: 'USD',
  withdrawAmount: 1000
};

describe('转账风险提示', () => {
  const initialValues = {
    externalData: {}
  };

  const wrap = shallow(<RistWarning initialValues={initialValues} />);

  describe('有同账出金转账任务提示', () => {
    describe('没有相关任务时', () => {
      beforeEach(() => {
        wrap.setProps({
          initialValues: initialValues
        });
        wrap.update();
      });
      it('不显示相关任务提示', () => {
        expect(wrap.find('[data-test="job-item"]').exists()).toBe(false);
      });
    });
    describe('有相关任务时', () => {
      beforeEach(() => {
        wrap.setProps({
          initialValues: {
            externalData: {
              identical: [normalIdentical]
            }
          }
        });
        wrap.update();
      });
      it('显示相关任务提示', () => {
        expect(wrap.find('[data-test="job-item"]').exists()).toBe(true);
      });
    });
  });
});
