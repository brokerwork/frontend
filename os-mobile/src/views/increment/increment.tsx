import React from 'react';
import cs from './increment.less';
import { observer } from 'mobx-react';
import state from './mobx';
import {
  NavBar,
  Icon,
  InputItem,
  Stepper,
  List,
  Picker,
  Toast,
  Modal
} from 'antd-mobile';
import { createForm } from 'rc-form';
import query from '@/utils/query';

interface Iprops {
  form: any;
  history: any;
}
interface Ivalue {
  actualCost: string;
  serviceName: Array<string>;
  serviceNum: string;
}
@observer
class Increment extends React.Component<Iprops> {
  state = {};
  componentDidMount() {
    state.fetchList(query.get('tenantId'), query.get('productId')).then(res => {
      this.onChange(state.list[0].value, 1);
    });
  }
  submit = () => {
    this.props.form.validateFields((error: any, value: any) => {
      if (error) {
        for (let i in error) {
          Toast.info(error[i].errors[0].message);
          break;
        }
      } else {
        state.toggleModal(true);
        this.value = value;
        this.name = state.list.find(
          el => el.value === value.serviceName[0]
        ).label;
      }
    });
  };
  value: Ivalue = {
    actualCost: '',
    serviceName: [],
    serviceNum: ''
  };
  name = '';
  onChange = (id?: any, num?: any) => {
    const { getFieldValue } = this.props.form;
    id = id || getFieldValue('serviceName');
    num = num || getFieldValue('serviceNum');
    state.compute(id, num);
  };
  confirm = () => {
    const {
      history: { push }
    } = this.props;
    state.save(
      {
        tenantId: query.get('tenantId'),
        productId: query.get('productId'),
        amount: this.value.actualCost,
        serverId: this.value.serviceName[0],
        orderQty: this.value.serviceNum
      },
      () => {
        this.value = {
          actualCost: '',
          serviceName: [],
          serviceNum: ''
        };

        state.toggleModal(false);
        push(
          `/product?tenantId=${query.get('tenantId')}&productId=${query.get(
            'productId'
          )}`
        );
      }
    );
  };
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div className={cs.content}>
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.goBack()}
        >
          添加增值服务
        </NavBar>
        <Picker
          data={state.list}
          cols={1}
          {...getFieldProps('serviceName', {
            onChange: this.onChange,
            rules: [{ required: true, message: '请选择服务名称' }],
            initialValue: [state.list[0].value]
          })}
        >
          <List.Item arrow="horizontal">增值服务名称</List.Item>
        </Picker>
        <InputItem extra={state.fee} editable={false}>
          增值服务费用
        </InputItem>
        <List.Item
          wrap
          extra={
            <Stepper
              {...getFieldProps('serviceNum', {
                onChange: this.onChange.bind(this, undefined),
                initialValue: 1
              })}
              showNumber
              max={100}
              min={1}
            />
          }
        >
          订购数量
        </List.Item>
        <InputItem extra={state.total} editable={false}>
          合计费用
        </InputItem>
        <InputItem
          {...getFieldProps('actualCost', {
            rules: [{ required: true, message: '请填写实际费用' }]
          })}
          type="number"
          clear
          placeholder="实际费用"
          className={cs.invoiceArea}
        >
          实际费用
        </InputItem>
        <div className={cs.footer}>
          <div onClick={this.submit}>提交增值服务操作</div>
        </div>
        <Modal
          visible={state.showModal}
          transparent
          maskClosable={false}
          title="确认提交购买"
          footer={[
            {
              text: '取消',
              onPress: () => {
                state.toggleModal(false);
              }
            },
            { text: '确定', onPress: this.confirm }
          ]}
        >
          <List.Item wrap extra={this.name}>
            增值服务名称
          </List.Item>
          <List.Item wrap extra={state.fee}>
            增值服务费
          </List.Item>
          <List.Item wrap extra={this.props.form.getFieldValue('serviceNum')}>
            订购数量
          </List.Item>
          <List.Item wrap extra={state.total}>
            合计费用
          </List.Item>
          <List.Item wrap extra={this.props.form.getFieldValue('actualCost')}>
            实际费用
          </List.Item>
        </Modal>
      </div>
    );
  }
}
export default createForm()(Increment);
