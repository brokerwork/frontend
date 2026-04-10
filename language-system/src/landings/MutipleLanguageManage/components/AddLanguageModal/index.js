import React, { useRef } from "react";
import { Modal, Button, message } from "antd";
import { useStore } from "src/utils/provider.js";
import { observer } from "mobx-react-lite";
import AddForm from "./addForm";
import { useGlobalStores } from "src/hooks/useGlobalStores";

const AddLanguageModal = observer(() => {
  const addFormEl = useRef(null);
  const store = useStore();
  const { commonStore } = useGlobalStores();

  const handleCancel = () => {
    store.isModalVisible(false);
    // 重置表单
    addFormEl.current.resetFields();
  };
  const handleOk = () => {
    addFormEl.current.validateFields((err, values) => {
      if (!err) {
        store.addLanguage(values).then(res => {
          if (res.result) {
            message.success("新增成功");
            setTimeout(() => {
              commonStore.getLanguageList();
              handleCancel();
            }, 300);
          }
        });
      }
    });
  };

  return (
    <div>
      <Modal
        title="新增语言"
        visible={store.addModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <AddForm ref={addFormEl} />
      </Modal>
    </div>
  );
});

export default AddLanguageModal;
