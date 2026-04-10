import * as React from 'react';
import CustomField from '../../common/CustomField/CustomField';
import {Card, Panel, Button} from 'fooui';

interface P {
  data: {},
  fields: any[],
  save: Function,
  externalData?: {},
  title: string,
}

interface S {

}

export default class CustomerCard extends React.Component<P, S> {
  basic = {
    data: {},
    error: {}
  }
  save = () => {
    this.props.save(this.basic.data);
    this.refs.addcustomer.close();
  }
  show = ()=>{
    this.refs.addcustomer.show()
  }
  cancel = () => {
    this.refs.addcustomer.close();
  }
  basicDataChange = (data, error) => {
    this.basic = {
      data: data,
      error: error
    };
  }
  render() {
    let {data, fields, externalData, title} = this.props;
    // 添加时不显示创建时间
    fields = fields.filter((item) => {
      return item.key !== 'createTime'
    });
    return (
      <Card title={title} ref="addcustomer">
        <Panel title="基本资料" className="subcard-panel">
          <CustomField
            data={data || {}}
            fields={fields}
            i18n={{}}
            onChange={this.basicDataChange}
            externalData={externalData}
          />
          <div className='text-right'>
            <Button bsStyle="primary" onClick={this.save}>保存</Button>
            <Button bsStyle="default" onClick={this.cancel}>取消</Button>
          </div>
        </Panel>
      </Card>
    );
  }
}

