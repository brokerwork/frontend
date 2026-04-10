import React from "react";
import Badge from "../components/Badge";
import { action } from "@storybook/addon-actions";
import Button, { ButtonGroup } from "../components/Button";
import Switch from "../components/Switch";
import Icon from "../components/Icon";

const notLastOptions = {
  showSource: false,
  allowSourceToggling: true,
  showPropTables: false,
  allowPropTablesToggling: false
};

class Demo extends React.Component {
  state = {
    count: 5,
    show: true
  };

  increase = () => {
    const count = this.state.count + 1;
    this.setState({ count });
  };

  decline = () => {
    let count = this.state.count - 1;
    if (count < 0) {
      count = 0;
    }
    this.setState({ count });
  };

  onChange = show => {
    this.setState({ show });
  };

  render() {
    return (
      <div>
        <div>
          <Badge count={this.state.count}>
            <a href="#" className="badge-example" />
          </Badge>
          <ButtonGroup>
            <Button onClick={this.decline}>
              <Icon icon="minus-outline" />
            </Button>
            <Button onClick={this.increase}>
              <Icon icon="add-outline" />
            </Button>
          </ButtonGroup>
        </div>
        <div style={{ marginTop: 10 }}>
          <Badge dot={this.state.show}>
            <a href="#" className="badge-example" />
          </Badge>
          <Badge dot={this.state.show} blink>
            <a href="#" className="badge-example" />
          </Badge>
          <Switch onChange={this.onChange} checked={this.state.show} />
        </div>
      </div>
    );
  }
}

export default {
  chapters: [
    {
      sections: [
        {
          title: "基本",
          options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-demo badge-demo">
                <Badge count={2}>
                  <a className="badge-example" />
                </Badge>
                <Badge count={15}>
                  <a className="badge-example" />
                </Badge>
                <Badge count={1000}>
                  <a className="badge-example" />
                </Badge>
                <Badge count={1000}>
                  <Button>Secondary</Button>
                </Badge>
                <Badge count={1000}>
                  <a href="#">Link something</a>
                </Badge>
              </div>
            );
          }
        },
        {
          title: "独立使用",
          options: notLastOptions,
          info: "不包裹任何元素即是独立使用，可自定样式展现。",
          sectionFn: () => {
            return (
              <div className="story-demo badge-demo">
                <Badge count={25} />
                <Badge
                  count={4}
                  style={{
                    backgroundColor: "#fff",
                    color: "#999",
                    boxShadow: "0 0 0 1px #d9d9d9 inset"
                  }}
                />
                <Badge count={109} style={{ backgroundColor: "#52c41a" }} />
              </div>
            );
          }
        },
        {
          title: "封顶数字",
          info:
            "超过 **overflowCount** 的会显示为 **${overflowCount}+**，默认的 **overflowCount** 为 **99**。",
          options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-demo badge-demo">
                <Badge count={125} overflowCount={10}>
                  <a className="badge-example" />
                </Badge>
                <Badge count={125} overflowCount={100}>
                  <a className="badge-example" />
                </Badge>
                <Badge count={125} overflowCount={230}>
                  <a className="badge-example" />
                </Badge>
              </div>
            );
          }
        },
        {
          title: "红点",
          info: "没有具体的数字。",
          options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-demo badge-demo">
                <Badge dot>
                  <a className="badge-example" />
                </Badge>
                <Badge count={0} dot>
                  <a className="badge-example" />
                </Badge>
                <Badge dot>
                  <Icon icon="calender" />
                </Badge>
                <Badge dot>
                  <a href="#">Link something</a>
                </Badge>
              </div>
            );
          }
        },
        {
          title: "红点闪烁动画",
          info: "**dot = true 的情况下，blink = true** 来开启",
          options: notLastOptions,          
          sectionFn: () => {
            return (
              <div className="story-demo badge-demo">
                <Badge dot blink>
                  <a className="badge-example" />
                </Badge>
              </div>
            );
          }
        },
        {
          title: "动态",
          options: notLastOptions,          
          sectionFn: () => {
            return (
              <div className="story-demo badge-demo">
                <Demo />
              </div>
            );
          }
        },
        {
          title: "自定义内容",
          // options: notLastOptions,          
          sectionFn: () => {
            return (
              <div className="story-demo badge-demo">
                <Badge content={<span>new</span>}>
                  <a className="badge-example" />
                </Badge>
                <Badge content={'hot'}>
                  <a className="badge-example" />
                </Badge>
              </div>
            );
          }
        }
      ]
    }
  ]
};
