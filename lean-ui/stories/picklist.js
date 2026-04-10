import React from "react";
import Picklist from "../components/Picklist";
import Button from "../components/Button";
import { array } from "@storybook/addon-knobs/react";
import { hidden } from "ansi-colors";
import { Ellipse } from "glamorous";

const data = [
  {
    label: "label1",
    value: 1
  },
  {
    label: "label2",
    value: 2
  },
  {
    label: "label3",
    value: 3
  },
  {
    label: "label4",
    value: 4
  },
  {
    label: "label5",
    value: 5
  },
  {
    label: "label6",
    value: 6
  },
  {
    label: "label7",
    value: 7
  },
  {
    label: "label8",
    value: 8
  }
];

const groupData = [
  { title: "group data 1", children: [].concat(data) },
  { title: "group data 2", children: [].concat(data) },
  { title: "group data 3", children: [].concat(data) }
];

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      arr: ["1"]
    };
  }
  onClick() {
    this.setState({
      arr: ["2"]
    });
  }
  onVisibleChange(visible) {
    console.log("onVisibleChange", visible);
  }
  render() {
    const { arr } = this.state;
    return (
      <div>
        <Picklist
          data={data}
          defaultSelectedKeys={arr}
          placeholder={"来点我啊1"}
          onChange={function(selectedItem) {
            console.log("selectedItem", selectedItem);
          }}
          onVisibleChange={this.onVisibleChange.bind(this)}
        />
        <Button onClick={this.onClick.bind(this)}>click</Button>
      </div>
    );
  }
}

class SelectAll extends React.Component {
  state = {
    selectedKeys: []
  };
  render() {
    return (
      <Picklist
        selectall
        selectallText="全部"
        searchable
        data={data}
        defaultSelectedKeys={this.state.selectedKeys}
        onChange={d => {
          console.log(d);
          this.setState({
            selectedKeys: d.map(r => r.toString())
          });
        }}
      />
    );
  }
}

class RemoteSearch extends React.Component {
  constructor() {
    super();
    this.state = {
      data,
      arr: []
    };
  }
  onClick() {
    this.setState({
      arr: ["2"]
    });
  }
  onSearchKeyChange = () => {
    this.setState({
      data: [
        {
          label: "label1",
          value: 1
        },
        {
          label: "label2",
          value: 2
        }
      ]
    });
  };
  onVisibleChange(visible) {
    console.log("onVisibleChange", visible);
  }
  render() {
    const { arr, data } = this.state;
    return (
      <div>
        <Picklist
          data={data}
          defaultSelectedKeys={arr}
          placeholder={"远端请求"}
          onChange={function(selectedItem) {
            console.log("selectedItem", selectedItem);
          }}
          onVisibleChange={this.onVisibleChange.bind(this)}
          searchable
          isRemoteSearch
          onSearchKeyChange={this.onSearchKeyChange}
        />
        <Button onClick={this.onClick.bind(this)}>click</Button>
      </div>
    );
  }
}

export default {
  chapters: [
    {
      sections: [
        {
          title: "Picklist",
          info: "Picklist",
          sectionFn: () => {
            return (
              <div className="story-demo">
                <Picklist
                  data={data}
                  defaultSelectedKeys={[1, 2, 3, 4, 6, 7, 8].map(t =>
                    t.toString()
                  )}
                  placeholder={"来点我啊1"}
                  onChange={function(selectedItem) {
                    console.log("selectedItem", selectedItem);
                  }}
                />
              </div>
            );
          }
        },
        {
          title: "Picklist disabled",
          info: "Picklist disabled",
          sectionFn: () => {
            return (
              <div className="story-demo">
                <Picklist
                  data={data}
                  disabled
                  defaultSelectedKeys={[1, 2, 3, 4]}
                  placeholder={"来点我啊1"}
                  onChange={function(selectedItem) {
                    console.log("selectedItem", selectedItem);
                  }}
                />
              </div>
            );
          }
        },
        {
          title: "Picklist Group",
          info: "Picklist Group",
          sectionFn: () => {
            return (
              <div className="story-demo">
                <Picklist
                  data={groupData}
                  searchable
                  onSearchKeyChange={function(value) {
                    console.log("keyChange", value);
                  }}
                  defaultSelectedKeys={["1"]}
                  placeholder={"来点我啊2"}
                  onChange={function(selectedItem) {
                    console.log("selectedItem", selectedItem);
                  }}
                />
              </div>
            );
          }
        },
        {
          title: "全选测试",
          info:
            'Picklist 添加全选功能.传入props<selectall=true, selectallText="全部">',
          sectionFn: () => {
            return <SelectAll />;
          }
        },
        {
          title: "自定义已选择项显示内容",
          info:
            "Picklist 添加自定义已选择项显示内容功能.传入props customSelectedDisplay(selectedItems: {value, label}) 返回一个ReactNode",
          sectionFn: () => {
            return (
              <div className="story-demo">
                <Picklist
                  data={data}
                  defaultSelectedKeys={[1, 2, 3, 4, 6, 7, 8].map(t =>
                    t.toString()
                  )}
                  placeholder={"来点我啊1"}
                  onChange={function(selectedItem) {
                    console.log("selectedItem", selectedItem);
                  }}
                  customSelectedDisplay={selectedItems => {
                    const selectedItemsLabel = selectedItems.map(item => {
                      return item.label;
                    });
                    return (
                      <div
                        style={{
                          overflow: "hidden",
                          width: "100%",
                          textOverflow: "ellipsis"
                        }}
                      >
                        {selectedItemsLabel.join(",")}
                      </div>
                    );
                  }}
                />
              </div>
            );
          }
        },
        {
          title: "Picklist",
          info: "Picklist",
          sectionFn: () => {
            return (
              <div className="story-demo">
                <App />
              </div>
            );
          }
        },
        {
          title: "远端获取数据",
          info: "主要测试 searchmode 是否正确",
          sectionFn: () => {
            return (
              <div className="story-demo">
                <RemoteSearch />
              </div>
            );
          }
        }
      ]
    }
  ]
};
