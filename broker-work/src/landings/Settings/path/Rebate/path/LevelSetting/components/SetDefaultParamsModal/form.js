import { reduxForm, Field, FieldArray } from 'redux-form';
import { Form, Select } from 'lean-ui';
import { renderField, required } from 'utils/v2/renderField';
import cs from './index.less';
import i18n from 'utils/i18n';
import DropdownForCode from 'components/v2/DropdownForCode';
import _ from 'lodash';

const FormItem = Form.Item;
const FormLabel = Form.Label;
const FormControl = Form.Control;
// export const DEFAULT_PARAMS_FORM = 'LEVEL_SETTING_DEFAULT_PARAMS_SETTING_FORM';

export default class DefaultParamsForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataList: props.levelList
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      dataList: nextProps.levelList
    });
  }
  handleSelect = id => val => {
    const dataList = [...this.state.dataList];
    const findItem = dataList.find(data => data.ruleId === id);
    if (findItem) {
      findItem.ruleDetailId = val;
    }
    this.setState({
      dataList
    });
  };

  submitData = () => {
    const { dataList } = this.state;
    return dataList.map(level => {
      let dataItem = {};
      dataItem.ruleId = level.ruleId;
      dataItem.ruleDetailId = level.ruleDetailId;
      const findItem = level.ruleDetails.find(
        item => level.ruleDetailId === item.value
      );
      if (findItem) {
        dataItem.commissionValue = findItem.label;
      }
      return dataItem;
    });
  };
  render() {
    const { dataList } = this.state;
    return (
      <Form>
        {dataList.map((level, index) => (
          <FormItem className={cs.form_item} key={index}>
            <FormLabel>{level.ruleName}</FormLabel>
            <FormControl className={cs.form_control}>
              <div className={cs.field}>
                <DropdownForCode
                  value={level.ruleDetailId}
                  data={level.ruleDetails.map(item => ({
                    label: item.second,
                    value: item.first
                  }))}
                  onSelect={this.handleSelect(level.ruleId)}
                  placeholder={
                    i18n[
                      'settings.level_setting.default_params_setting.placeholder'
                    ]
                  }
                />
              </div>
              <span className={cs.form_unit}>
                {level.balanceType === 0 ? '$' : '%'}/
                {level.balanceUnit === 0
                  ? i18n[
                      'settings.level_setting.default_params_setting.unit.hand'
                    ]
                  : i18n[
                      'settings.level_setting.default_params_setting.unit.handle'
                    ]}
              </span>
            </FormControl>
          </FormItem>
        ))}
      </Form>
    );
  }
}
