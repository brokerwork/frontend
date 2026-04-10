import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "src/utils/provider.js";
import List from "../List";
import AddLanguageModal from "../AddLanguageModal";
import { Button } from "antd";
import cs from "./index.less";
const Root = observer(() => {
  const store = useStore();
  const openAddModal = () => {
    store.isModalVisible(true);
  };
  return (
    <div>
      <div className={cs.top_btn_area}>
        <Button type="primary" onClick={openAddModal}>
          新增语言
        </Button>
      </div>
      <List />
      <AddLanguageModal />
    </div>
  );
});

export default Root;
