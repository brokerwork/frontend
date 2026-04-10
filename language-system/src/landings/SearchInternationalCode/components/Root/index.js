import React from "react";
import { observer } from "mobx-react-lite";
import Conditions from "../Conditions";
import EditTable from "../EditTable";

const Root = observer(() => {
  return (
    <div>
      <Conditions />
      <EditTable />
    </div>
  );
});

export default Root;
