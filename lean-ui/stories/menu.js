import React from "react";
import Menu from "../components/Menu";
import { action } from "@storybook/addon-actions";
import Icon from "../components/Icon";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";

const notLastOptions = {
  showSource: false,
  allowSourceToggling: true,
  showPropTables: false,
  allowPropTablesToggling: false
};

class ToggleCollapsedDemo extends React.Component {
  state = {
    collapsed: false
  };
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  render() {
    return (
      <div style={{ width: 256 }}>
        <Button
          type="primary"
          onClick={this.toggleCollapsed}
          style={{ marginBottom: 16 }}
        >
          {this.state.collapsed ? "展开" : "收起"}
        </Button>
        <Menu
          defaultSelectedKeys={["dashboard"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          inlineCollapsed={this.state.collapsed}
        >
          <Menu.Item key="dashboard">
            <Icon icon="dashboard" />
            <span>Home</span>
          </Menu.Item>
          <Menu.Item key="set-soild">
            <Icon icon="customer-data" />
            <span>导航二</span>
          </Menu.Item>
          <Menu.SubMenu
            key="sub1"
            title={
              <span>
                <Icon icon="dollar" />
                <span>导航三 子导航</span>
              </span>
            }
          >
            <Menu.Item key="setting:a">
              <span>选项 a</span>
            </Menu.Item>
            <Menu.Item key="setting:b">
              <span>选项 b</span>
            </Menu.Item>
            <Menu.Item key="setting:c">
              <span>选项 c</span>
            </Menu.Item>
            <Menu.Item key="setting:d">
              <span>选项 d</span>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            title={
              <span>
                <Icon icon="discover" />
                <span>导航三 子导航</span>
              </span>
            }
          >
            <Menu.ItemGroup title="Item 1">
              <Menu.Item key="setting:1">
                <span>选项 1</span>
              </Menu.Item>
              <Menu.Item key="setting:2">
                <span>选项 2</span>
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="Item 2">
              <Menu.Item key="setting:3">
                <span>选项 3</span>
              </Menu.Item>
              <Menu.Item key="setting:4">
                <span>选项 4</span>
              </Menu.Item>
            </Menu.ItemGroup>
          </Menu.SubMenu>
          <Menu.Item key="test">
            <a href="#">
              <Icon icon="telephone" />
              <span>导航五 链接导航</span>
            </a>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default {
  chapters: [
    {
      sections: [
        {
          title: "基本使用",
          options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-demo menu-demo">
                <Menu
                  // onClick={(...args) => {
                  //   console.log(args);
                  // }}
                  // selectedKeys={["setting:1"]}
                  mode="horizontal"
                  triggerSubMenuAction="click"
                >
                  <Menu.Item key="dashboard">导航一</Menu.Item>
                  <Menu.Item key="set-soild" disabled>
                    导航二
                  </Menu.Item>
                  <Menu.SubMenu title={<span>导航三 子导航</span>}>
                    <Menu.ItemGroup title="Item 1">
                      <Menu.Item key="setting:1">选项 1</Menu.Item>
                      <Menu.Item key="setting:2">选项 2</Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup title="Item 2">
                      <Menu.Item key="setting:3">选项 3</Menu.Item>
                      <Menu.Item key="setting:4">选项 4</Menu.Item>
                    </Menu.ItemGroup>
                  </Menu.SubMenu>
                  <Menu.SubMenu title={<span>导航四 子导航</span>}>
                    <Menu.Item key="setting:a">选项 a</Menu.Item>
                    <Menu.Item key="setting:b">选项 b</Menu.Item>
                    <Menu.Item key="setting:c">选项 c</Menu.Item>
                    <Menu.Divider/>
                    <Menu.Item key="setting:d">选项 d</Menu.Item>
                  </Menu.SubMenu>
                  <Menu.Item key="test">
                    <a href="#">导航五 链接导航</a>
                  </Menu.Item>
                </Menu>
              </div>
            );
          }
        },
        {
          title: "设置初始值",
          options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-demo menu-demo">
                <Menu
                  // onClick={(...args) => {
                  //   console.log(args);
                  // }}
                  selectedKeys={["set-2"]}
                  mode="horizontal"
                  triggerSubMenuAction="click"
                >
                  <Menu.Item key="dashboard">导航一</Menu.Item>
                  <Menu.Item key="set-2">
                    导航二
                  </Menu.Item>
                  <Menu.Item key="set-3">
                    导航三
                  </Menu.Item>
                  <Menu.Item key="set-4">
                    导航四
                  </Menu.Item>
                </Menu>
              </div>
            );
          }
        },
        {
          title: "Dropdown中的使用",
          options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-demo menu-demo" style={{ width: "200px" }}>
                <Dropdown
                  trigger={["click"]}
                  overlay={
                    <Menu selectable>
                      <Menu.Item key="dashboard">导航一</Menu.Item>
                      <Menu.Item key="set-soild" disabled>
                        导航二
                      </Menu.Item>
                      <Menu.ItemGroup title={<span> 子导航</span>}>
                        <Menu.Item key="setting:2a">选项 a</Menu.Item>
                        <Menu.Item key="setting:2b">选项 b</Menu.Item>
                        <Menu.Item key="setting:2c">选项 c</Menu.Item>
                        <Menu.Item key="setting:2d">选项 d</Menu.Item>
                      </Menu.ItemGroup>
                      <Menu.SubMenu title={<span>导航三 子导航</span>}>
                        <Menu.ItemGroup title="Item 1">
                          <Menu.Item key="setting:1">选项 1</Menu.Item>
                          <Menu.Item key="setting:2">选项 2</Menu.Item>
                        </Menu.ItemGroup>
                        <Menu.ItemGroup title="Item 2">
                          <Menu.Item key="setting:3">选项 3</Menu.Item>
                          <Menu.Item key="setting:4">选项 4</Menu.Item>
                        </Menu.ItemGroup>
                      </Menu.SubMenu>
                      <Menu.SubMenu title={<span>导航四 子导航</span>}>
                        <Menu.Item key="setting:a">选项 a</Menu.Item>
                        <Menu.Item key="setting:b">选项 b</Menu.Item>
                        <Menu.Item key="setting:c">选项 c</Menu.Item>
                        <Menu.Item key="setting:d">选项 d</Menu.Item>
                      </Menu.SubMenu>
                      <Menu.Item key="test">
                        <a href="#">导航五 链接导航</a>
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button style={{ cursor: "pointer" }}>
                    Click me <Icon icon="down" />
                  </Button>
                </Dropdown>
              </div>
            );
          }
        },
        {
          title: "垂直菜单",
          options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-demo menu-demo" style={{ width: "200px" }}>
                <Menu
                  selectedKeys={["dashboard"]}
                  defaultOpenKeys={["sub1", "sub2"]}
                  mode="inline"
                >
                  <Menu.Item key="dashboard">
                    <Icon icon="dashboard" />
                    <span>Home</span>
                  </Menu.Item>
                  <Menu.Item key="set-soild">
                    <Icon icon="customer-data" />导航二
                  </Menu.Item>
                  <Menu.SubMenu
                    key="sub1"
                    title={
                      <span>
                        <Icon icon="dollar" />导航三 子导航
                      </span>
                    }
                  >
                    <Menu.Item key="setting:a">选项 a</Menu.Item>
                    <Menu.Item key="setting:b">选项 b</Menu.Item>
                    <Menu.Item key="setting:c">选项 c</Menu.Item>
                    <Menu.Item key="setting:d">选项 d</Menu.Item>
                  </Menu.SubMenu>
                  <Menu.Item key="test">
                    <a href="#">导航五 链接导航</a>
                  </Menu.Item>
                </Menu>
              </div>
            );
          }
        },
        {
          title: "切换",
          options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-demo menu-demo" style={{ width: "200px" }}>
                <ToggleCollapsedDemo />
              </div>
            );
          }
        },
        {
          title: "收缩模式",
          info: 'MenuItem 和 SubMenu props见 [rc-menu文档](https://github.com/react-component/menu)',
          // options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-demo menu-demo" style={{ width: "200px" }}>
                <Menu
                  defaultSelectedKeys={["1"]}
                  mode="inline"
                  inlineCollapsed={true}
                >
                  <Menu.Item key="dashboard">
                    <Icon icon="dashboard" />
                    <span>Home</span>
                  </Menu.Item>
                  <Menu.Item key="set-soild">
                    <Icon icon="customer-data" />
                    <span>导航二</span>
                  </Menu.Item>
                  <Menu.SubMenu
                    key="sub1"
                    title={
                      <span>
                        <Icon icon="dollar" />
                        <span>导航三 子导航</span>
                      </span>
                    }
                  >
                    <Menu.Item key="setting:a">
                      <span>选项 a</span>
                    </Menu.Item>
                    <Menu.Item key="setting:b">
                      <span>选项 b</span>
                    </Menu.Item>
                    <Menu.Item key="setting:c">
                      <span>选项 c</span>
                    </Menu.Item>
                    <Menu.Item key="setting:d">
                      <span>选项 d</span>
                    </Menu.Item>
                  </Menu.SubMenu>
                </Menu>
              </div>
            );
          }
        }
      ]
    }
  ]
};
