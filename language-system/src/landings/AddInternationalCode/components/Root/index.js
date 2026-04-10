import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "src/utils/provider.js";
// import { useGlobalStores } from "hooks/useGlobalStores";
import { Tabs } from "antd";
const { TabPane } = Tabs;
import { TAB_LISTS } from "../../constants";

import WrappedFormContent from "../FormContent";
const Root = observer(() => {
  const store = useStore();
  const handleActiveChange = key => {
    store.handleActive(key);
  };
  return (
    <div>
      <Tabs
        defaultActiveKey="BW"
        onChange={handleActiveChange}
        animated={false}
      >
        {TAB_LISTS.map(item => (
          <TabPane tab={item.label} key={item.value}>
            <WrappedFormContent name={item.value} />
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
});

export default Root;
