import React from "react";
import Checkbox from "../components/Checkbox";
import { action, decorateAction } from "@storybook/addon-actions";
const CheckboxGroup = Checkbox.Group;

function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}

function ongroupChange(checkedValues) {
  console.log('checked = ', checkedValues);
} 
const plainOptions = ['Apple', 'Pear', 'Orange'];
const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
];
const optionsWithDisabled = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange', disabled: false },
];
const plainAllOptions = ['Apple', 'Pear', 'Orange'];
const defaultCheckedList = ['Apple', 'Orange'];
class Demo extends React.Component {
  state = {
    checkedList: defaultCheckedList,
    indeterminate: true,
    checkAll: false,
  };
  render() {
    return (
      <div>
        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            Check all
          </Checkbox>
        </div>
        <br />
        <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange} />
      </div>
    );
  }
  onChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  }
  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }
}

export default {
  chapters: [
    {
      sections: [
        {
          title: "Checkbox",
          info: "多选框",
          sectionFn: () => {
            return (
              <div>
                <div className="story-demo">
                  <Checkbox onChange={onChange}>Checkbox</Checkbox>
                </div>
                <br /><br />
                <div>CheckboxGroup</div>
                <br /><br />
                <div className="story-demo">
                  <CheckboxGroup options={plainOptions} defaultValue={['Apple']} onChange={ongroupChange} />
                  <br /><br />
                  <CheckboxGroup options={options} defaultValue={['Pear']} onChange={ongroupChange} />
                  <br /><br />
                  <CheckboxGroup options={optionsWithDisabled} disabled defaultValue={['Apple']} onChange={ongroupChange} />
                </div>
                <br /><br />
                <div>Check All</div>
                <br /><br />
                <Demo />
              </div>
            );
          }
        }
      ]
    }
  ]
};
