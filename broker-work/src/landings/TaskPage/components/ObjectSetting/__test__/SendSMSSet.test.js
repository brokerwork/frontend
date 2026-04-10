import { shallow } from 'enzyme';
import { SendSMSSet } from '../index';

const defaultData = {
  isSMSPay: false,
  sendSMS: false
};
const getEditValue = bool => {
  return bool;
};

describe('消息通知设置', () => {
  const wrap = shallow(
    <SendSMSSet data={defaultData} edit={getEditValue} disabled={false} />
  );

  describe('邮件通知选项', () => {
    it('正常展示', () => {
      expect(wrap.find('[data-test="email-checkbox"]').exists()).toBe(true);
    });
    it('默认选中', () => {
      expect(wrap.find('[data-test="email-checkbox"]').prop('checked')).toBe(
        true
      );
    });
    it('不可编辑', () => {
      expect(wrap.find('[data-test="email-checkbox"]').prop('disabled')).toBe(
        true
      );
    });
  });

  describe('短信通知选项', () => {
    it('正常展示', () => {
      expect(wrap.find('[data-test="sms-checkbox"]').exists()).toBe(true);
    });
    it('展示提示', () => {
      expect(wrap.find('[data-test="sms-tips"]').exists()).toBe(true);
    });
    describe('初始值赋值', () => {
      describe('初始值为true', () => {
        beforeEach(() => {
          wrap.setProps({
            data: {
              ...defaultData,
              sendSMS: true
            }
          });
          wrap.update();
        });
        it('选中状态', () => {
          expect(wrap.find('[data-test="sms-checkbox"]').prop('checked')).toBe(
            true
          );
        });
      });
      describe('初始值为false', () => {
        beforeEach(() => {
          wrap.setProps({
            data: {
              ...defaultData,
              sendSMS: false
            }
          });
          wrap.update();
        });
        it('非选中状态', () => {
          expect(wrap.find('[data-test="sms-checkbox"]').prop('checked')).toBe(
            false
          );
        });
      });
    });

    describe('如果没有开通短信增值服务', () => {
      beforeEach(() => {
        wrap.setProps({
          data: {
            ...defaultData,
            isSMSPay: false
          }
        });
        wrap.update();
      });

      it('不可编辑', () => {
        expect(wrap.find('[data-test="sms-checkbox"]').prop('disabled')).toBe(
          true
        );
      });
    });

    describe('如果是开通过的', () => {
      beforeEach(() => {
        wrap.setProps({
          data: {
            ...defaultData,
            isSMSPay: true
          }
        });
      });
      wrap.update();
      it('可编辑', () => {
        expect(wrap.find('[data-test="sms-checkbox"]').prop('disabled')).toBe(
          false
        );
      });
    });
  });
});
