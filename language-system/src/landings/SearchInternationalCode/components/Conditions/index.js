import React from "react";
import { Form, Input, Button } from "antd";
import cs from "./index.less";
import { useStore } from "src/utils/provider.js";

import { observer } from "mobx-react-lite";

const Conditions = observer(props => {
  const store = useStore();
  const onSearch = e => {
    store.getLangList();
  };
  // 键盘回车搜索
  const onKeySearch = e => {
    if (e.nativeEvent.keyCode === 13) {
      store.getLangList();
    }
  };
  const handleConditionsChange = key => e => {
    store.changeCondition(key, e.target.value);
  };
  return (
    <div className={cs.condition_box}>
      <Form layout="inline">
        <Form.Item label="res_key">
          <Input
            placeholder="请输入res_key"
            onChange={handleConditionsChange("searchResKey")}
            onKeyDown={onKeySearch}
          />
        </Form.Item>
        <Form.Item label="翻译">
          <Input
            placeholder="请输入翻译"
            onChange={handleConditionsChange("searchContent")}
            onKeyDown={onKeySearch}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={onSearch}>
            查询
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});

export default Conditions;
