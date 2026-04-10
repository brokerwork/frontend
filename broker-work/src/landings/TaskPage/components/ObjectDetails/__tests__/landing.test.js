import { shallow } from 'enzyme';
import Landing from '../landing';
const userRightsWithTW = {
  MESSAGE_SEND_OBJECT_TW: true
};
const objectList = [
  {
    itemId: 'cb966aff-9410-4636-843d-2669466d4523',
    itemName: 'Trader Work ',
    taskType: 'TA',
    todoCount: 0
  },
  {
    itemId: '8df50e9c-2576-4072-9300-92ed076fdf62',
    itemName: 'agent task',
    taskType: 'AGENCY',
    todoCount: 4
  }
];
const match = {
  params: {
    objectId: 'cb966aff-9410-4636-843d-2669466d4523'
  },
  path: 'path/:objectId'
};

const objectDetails = {
  participantNum: 1
};

describe('任务列表Landing', () => {
  const wrap = shallow(
    <Landing
      objectDetails={objectDetails}
      match={match}
      objectList={objectList}
    />
  );
  describe('任务类型tabs', () => {
    describe('当有可用任务类型时', () => {
      it('tabs的显示', () => {
        expect(wrap.find('[data-test="task-tabs-box"]').exists()).toBe(true);
      });
      it('tabs的个数正确', () => {
        expect(wrap.find('[data-test="task-tabs-box"]').children().length).toBe(
          2
        );
      });
      it('tabs气泡提示', () => {
        expect(wrap.find('[data-test="task-tabs-todo-AGENCY"]').text()).toBe(
          '4'
        );
      });
      it('tabs气泡个数为0时不显示', () => {
        expect(wrap.find('[data-test="task-tabs-todo-TA"]').exists()).toBe(
          false
        );
      });
    });
    describe('当无有可用任务类型时', () => {
      beforeEach(() => {
        wrap.setProps({
          objectList: []
        });
        wrap.update();
      });
      it('tabs不显示', () => {
        expect(wrap.find('[data-test="task-tabs-box"]').exists()).toBe(false);
      });
    });
  });
});
