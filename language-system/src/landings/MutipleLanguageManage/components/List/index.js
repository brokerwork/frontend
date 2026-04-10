import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Table, Button, Modal, message } from "antd";
import { useStore } from "src/utils/provider.js";
import { useGlobalStores } from "src/hooks/useGlobalStores";

const { confirm } = Modal;
const List = observer(() => {
  const store = useStore();
  const { commonStore } = useGlobalStores();
  const onLanguageRemove = async id => {
    const { result } = await store.removeLanguage(id);
    if (result) {
      message.success("删除成功");
      commonStore.getLanguageList();
    }
  };
  const showDeleteConfirm = id => {
    confirm({
      title: "确认删除此语言?",
      content: "",
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        onLanguageRemove(id);
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };
  const columns = [
    {
      title: "编号",
      key: "num",
      render: (text, record, index) => <span>{index}</span>
    },
    {
      title: "语言",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "标识",
      dataIndex: "lang",
      key: "lang"
    },
    {
      title: "状态",
      dataIndex: "enable",
      key: "enable",
      render: text => <span>{text ? "启用" : "未启用"}</span>
    },
    {
      title: "操作",
      key: "operate",
      render: (text, record) => (
        <Button type="primary" onClick={() => showDeleteConfirm(record["id"])}>
          删除
        </Button>
      )
    }
  ];
  // useEffect(() => {
  //   store.getLanguageLists();
  // }, [store]);
  return (
    <div>
      <Table
        pagination={false}
        columns={columns}
        dataSource={commonStore.languageList}
        rowKey="id"
      />
    </div>
  );
});

export default List;
