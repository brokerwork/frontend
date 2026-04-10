import React from "react";
import Dropdown from "../components/Dropdown";
import Icon from "../components/Icon";
import Menu from "../components/Menu";

const menu = (
  <Menu>
    <Menu.Item>1st menu item</Menu.Item>
    <Menu.Item>2nd menu item</Menu.Item>
    <Menu.Item disabled={true}>3rd menu item</Menu.Item>
  </Menu>
);

export default {
  chapters: [
    {
      sections: [
        {
          title: "dropdown",
          info: "下拉菜单",
          sectionFn: () => {
            return (
              <div>
                <div>
                  <div className="story-demo">
                    <Dropdown overlay={menu} trigger="click">
                      <span>
                        Hover me <Icon icon="arrow-down" />
                      </span>
                    </Dropdown>
                  </div>
                  <div
                    style={{
                      height: "200px",
                      overflow: "auto",
                      marginTop: "50px",
                      border: "1px solid #ccc"
                    }}
                  >
                    <div
                      className="story-demo"
                      style={{
                        height: "1000px",
                        position: "relative"
                      }}
                      id="aa"
                    >
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <Dropdown
                        overlay={menu}
                        getPopupContainer={e => document.getElementById("aa")}
                        trigger="click"
                      >
                        <span>
                          Hover me <Icon icon="arrow-down" />
                        </span>
                      </Dropdown>
                      <br />
                      <br />
                      <br />
                      <br />
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        }
      ]
    }
  ]
};
