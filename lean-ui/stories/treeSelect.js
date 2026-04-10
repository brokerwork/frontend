import React from "react";
import TreeSelect from "../components/TreeSelect";
import { action } from "@storybook/addon-actions";
const TreeNode = TreeSelect.TreeNode;
class Demo extends React.Component {
  state = {
    value: undefined
  };

  onChange = value => {
    console.log(value);
    this.setState({ value });
  };

  render() {
    return (
      <TreeSelect
        showSearch
        style={{ width: 300 }}
        value={this.state.value}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        placeholder="Please select"
        allowClear
        treeDefaultExpandAll
        onChange={this.onChange}
        treeCheckable
      >
        <TreeNode value="parent 1" title="parent 1" key="0-1">
          <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
            <TreeNode value="leaf1" title="my leaf" key="random" />
            <TreeNode value="leaf2" title="your leaf" key="random1" />
          </TreeNode>
          <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
            <TreeNode
              value="sss"
              title={<b style={{ color: "#08c" }}>sss</b>}
              key="random3"
            />
          </TreeNode>
        </TreeNode>
      </TreeSelect>
    );
  }
}
const treeData = [
  {
    children: [
      {
        disabled: false,
        key: "CFHCFD",
        label: "CFD",
        value: "CFHCFD"
      }
    ],
    disabled: false,
    key: "CFH",
    label: "CFH",
    value: "CFH"
  }
];
class Test extends React.Component {
  state = {
    value: undefined
  };

  onChange = value => {
    console.log(value);
    this.setState({ value });
  };
  onSelect = value => {
    console.log(value);
    this.setState({ value });
  };

  render() {
    return (
      <TreeSelect
        treeData={treeData}
        value={[]}
        treeCheckStrictly
        dropdownStyle={{ maxHeight: 320, overflow: "auto" }}
        allowClear
        treeDefaultExpandAll
        multiple
        treeCheckable
        onSelect={this.onSelect}
        onChange={this.onChange}
      />
    );
  }
}
export default {
  chapters: [
    {
      sections: [
        {
          title: "树形控件",
          info: "树形控件",
          sectionFn: () => {
            return (
              <div>
                <Demo />
                <Test />
              </div>
            );
          }
        }
      ]
    }
  ]
};
