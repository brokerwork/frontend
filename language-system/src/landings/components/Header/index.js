import React from "react";
import { Button } from "antd";
import cs from "./index.less";
const Header = () => {
  return (
    <div className={cs.header_container}>
      <h1>国际化管理平台</h1>
      <div className={cs.header_button_area}>
        <Button type="primary">退出登陆</Button>
      </div>
    </div>
  );
};

export default Header;
