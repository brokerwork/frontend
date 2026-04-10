import { shallow } from 'enzyme';
import { TaskVerfiySet } from '../index';

const despositItem = {
  categoryId: '1c1cd148-7862-4fa3-80fb-d3c8fc3ee2dc',
  categoryName: '入金申请',
  jobType: 'JOB_TYPE_TA_DEPOSIT',
  leverage: 100,
  leverage5: 100,
  stepNum: 1,
  threshold: undefined,
  verify: true
};
describe('任务审核设置', () => {
  const wrap = shallow(
    <TaskVerfiySet
      leverageList={[]}
      serverList={[]}
      onChange={() => {}}
      disabled={false}
      onSubmit={() => {}}
      onError={() => {}}
      cTraderFieldsLoaded={true}
      data={[]}
      taskType={'TA'}
    />
  );

  describe('入金审核设置', () => {
    beforeEach(() => {
      wrap.setProps({
        data: [despositItem]
      });
      wrap.update();
    });
    it('展示审核阀值输入框', () => {
      expect(wrap.find('[data-test="threshold-input"]').exists()).toBe(true);
    });

    describe('当选未选中部分审核时', () => {
      beforeEach(() => {
        wrap.setProps({
          data: [despositItem]
        });
        wrap.update();
      });
      it('输入框不可编辑', () => {
        expect(
          wrap.find('[data-test="threshold-input"]').prop('disabled')
        ).toBe(true);
      });
    });
    describe('当选中部分审核时', () => {
      beforeEach(() => {
        wrap.setProps({
          data: [
            {
              ...despositItem,
              verify: '',
              threshold: 0.5
            }
          ]
        });
        wrap.update();
      });
      it('输入框可编辑', () => {
        expect(
          wrap.find('[data-test="threshold-input"]').prop('disabled')
        ).toBe(false);
      });
      it('输入框取值正确', () => {
        expect(wrap.find('[data-test="threshold-input"]').prop('value')).toBe(
          0.5
        );
      });
    });
  });
});
