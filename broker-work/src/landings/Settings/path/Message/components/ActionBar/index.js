import cs from './ActionBar.less';
import { Select } from 'lean-ui'

const Option = Select.Option

export default class ActionBar extends Component {
  updateType = selected => {
    const { modifyParams, getTemplates } = this.props;
    Promise.resolve(modifyParams({ type: selected })).then(() => {
      getTemplates();
    });
  };
  render() {
    const { params = {}, messageType = [] } = this.props;
    return (
      <div className={cs['container']}>
        <Select
          onSelect={this.updateType}
          value={params['type']}>
          {
            messageType.map((item, index) => { 
              return <Option key={index} value={item.value}>{item.label}</Option>
            })
          }
        </Select>
      </div>
    );
  }
}
