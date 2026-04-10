import React from "react";
import { Menu, Icon } from "antd";
import { NavLink } from "react-router-dom";
import { MENU_LIST } from "src/landings/constants.js";
import { observer } from "mobx-react-lite";
import { withRouter } from "react-router";
import { useEffect, useState } from "react";

const LeftMenu = observer(props => {
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState([
    "addInternationalCode"
  ]);
  useEffect(() => {
    const {
      location: { pathname }
    } = props;
    const currentMenu = MENU_LIST.find(item => item.path === pathname);
    if (currentMenu) {
      setDefaultSelectedKeys([currentMenu.key]);
    }
  }, [props]);
  return (
    <div>
      <Menu
        style={{ width: 256, height: "100%" }}
        defaultSelectedKeys={defaultSelectedKeys}
        selectedKeys={defaultSelectedKeys}
        // defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="light"
      >
        {MENU_LIST.map(menu => {
          return (
            <Menu.Item key={menu.key}>
              <NavLink to={menu.path}>
                <Icon type={menu.icon} />
                {menu.label}
              </NavLink>
            </Menu.Item>
          );
        })}
      </Menu>
    </div>
  );
});
export default withRouter(LeftMenu);
