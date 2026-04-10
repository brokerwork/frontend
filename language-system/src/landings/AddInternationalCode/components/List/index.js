import React from "react";
import { useStore } from "src/utils/provider.js";
import { Button } from "antd";
import { observer } from "mobx-react-lite";

const List = observer(() => {
  const store = useStore();
  const handleChange = () => {
    store.handleChange();
  };
  return (
    <div>
      <Button onClick={handleChange}>添加</Button>
      <ul>
        {store.dataList.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
});
export default List;
