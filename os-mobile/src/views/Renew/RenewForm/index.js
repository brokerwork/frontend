import React from 'react';
import {
  InputItem,
  Switch,
  TextareaItem,
  List,
  Toast,
  Modal
} from 'antd-mobile';
import { observer } from 'mobx-react';
import cs from '../index.less';
import { createForm } from 'rc-form';
import { submitRenew } from '../api';
import query from '@/utils/query';
import _ from 'lodash';
import dayjs from 'dayjs';

@observer
class RennewForm extends React.Component {
  constructor(props) {
    super(props);
  }
  submit = () => {
    this.props.form.validateFields((error, value) => {
      if (error) {
        this.props.rennewStore.setErrors(error);
      } else {
        this.props.rennewStore.setFormValues(value);
        // this.props.rennewStore.modalVisible(true);
      }
    });
  };
  onErrorClick = name => {
    if (this.props.form.getFieldError(name)) {
      Toast.info(this.props.form.getFieldError(name));
    }
  };
  render() {
    const {
      form: { getFieldProps, getFieldError, getFieldValue },
      rennewStore: { modalVisible, showModal, formValues },
      history: { push }
    } = this.props;
    return (
      <div>
        <List>
          <InputItem
            {...getFieldProps('days', {
              rules: [{ required: true, message: '请填写购买时长' }]
            })}
            type="number"
            clear
            placeholder="请输入天数"
            labelNumber={6}
            error={getFieldError('days')}
            onErrorClick={this.onErrorClick.bind(this, 'days')}
            className={cs.invoiceArea}
          >
            购买时长(天)
          </InputItem>
          {getFieldValue('days') && (
            <div className={cs.dateLine}>
              到期时间：
              {dayjs(Number(query.get('expired')))
                .add(Number(getFieldValue('days')), 'day')
                .format('YYYY-MM-DD')}
            </div>
          )}
          <List.Item
            extra={
              <Switch
                {...getFieldProps('invoice', {
                  initialValue: false,
                  valuePropName: 'checked'
                })}
              />
            }
          >
            发票(税前5%)
          </List.Item>
          {getFieldValue('invoice') && (
            <TextareaItem
              {...getFieldProps('invoiceTitle', {
                rules: [{ required: true, message: '请填写发票抬头' }]
              })}
              title="发票抬头"
              placeholder="上海领壹信息科技有限公司"
              autoHeight
              labelNumber={6}
              error={getFieldError('invoiceTitle')}
              onErrorClick={this.onErrorClick.bind(this, 'invoiceTitle')}
              className={cs.invoiceArea}
            />
          )}
          <InputItem
            {...getFieldProps('amount', {
              rules: [{ required: true, message: '请填写合计费用' }]
            })}
            type="number"
            clear
            placeholder="请输入金额"
            labelNumber={6}
            error={getFieldError('amount')}
            onErrorClick={this.onErrorClick.bind(this, 'amount')}
            className={cs.invoiceArea}
          >
            合计费用($)
          </InputItem>
        </List>
        <div className={cs.footer}>
          <div onClick={this.submit}>提交续费操作</div>
        </div>
        {/* modal */}
        <Modal
          visible={showModal}
          transparent
          maskClosable={false}
          onClose={modalVisible.bind(this, false)}
          title="确认提交续费"
          footer={[
            {
              text: '取消',
              onPress: () => {
                modalVisible(false);
              }
            },
            {
              text: '确认',
              onPress: () => {
                modalVisible(false);
                const copyParams = _.cloneDeep(formValues);
                copyParams.invoice = copyParams.invoice ? 1 : 0;
                const params = {
                  tenantId: query.get('tenantId'),
                  productId: query.get('productId'),
                  ...copyParams
                };
                submitRenew(params).then(res => {
                  if (res.result) {
                    push(
                      `/product?tenantId=${query.get(
                        'tenantId'
                      )}&productId=${query.get('productId')}`
                    );
                  }
                });
              }
            }
          ]}
          afterClose={() => {
            // alert("afterClose");
          }}
        >
          <div className={cs.info}>
            <List>
              <List.Item multipleLine wrap extra={formValues.days}>
                购买时长(天)
              </List.Item>
              <List.Item
                extra={dayjs(Number(query.get('expired')))
                  .add(Number(formValues.days), 'day')
                  .format('YYYY-MM-DD')}
              >
                到期时间
              </List.Item>
              {formValues.invoice && (
                <List.Item multipleLine>
                  发票抬头
                  <List.Item.Brief>{formValues.invoiceTitle}</List.Item.Brief>
                </List.Item>
              )}
              <List.Item multipleLine wrap extra={formValues.amount}>
                合计费用($)
              </List.Item>
            </List>
          </div>
        </Modal>
      </div>
    );
  }
}

const RennewFormWrapper = createForm()(RennewForm);
export default RennewFormWrapper;
