import React from "react";
import { Link } from "react-router-dom";
import LeftMenu from "../LeftMenu";
import Header from "../Header";
import cs from "./index.less";
import { observer } from "mobx-react-lite";
import { Breadcrumb } from "antd";
import { MENU_LIST } from "landings/constants";
import { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { useGlobalStores } from "src/hooks/useGlobalStores";
const PageWraper = observer(props => {
  const [breadItem, setBreadItem] = useState("");
  const { commonStore } = useGlobalStores();
  useEffect(() => {
    const {
      location: { pathname }
    } = props;
    const currentMenu = MENU_LIST.find(item => item.path === pathname);
    if (currentMenu) {
      setBreadItem([currentMenu.label]);
    }
    commonStore.getLanguageList();
  }, [props, commonStore]);
  return (
    <div className={cs.wrapper_container}>
      <Header />
      <div className={cs.wrapper_content}>
        <LeftMenu />
        <div className={cs.right_content}>
          <div className={cs.bread_nav}>
            <Breadcrumb>
              <Breadcrumb.Item>{breadItem}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          {props.children}
        </div>
      </div>
    </div>
  );
});

export default withRouter(PageWraper);
