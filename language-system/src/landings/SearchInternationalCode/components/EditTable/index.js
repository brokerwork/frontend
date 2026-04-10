import { Table, Input, Button, Modal, Form, message } from "antd";
import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useGlobalStores } from "src/hooks/useGlobalStores";
import { useStore } from "src/utils/provider";
import _ from "lodash";
import cs from "./index.less";
const EditableContext = React.createContext();
const { confirm } = Modal;
const EditableCell = props => {
  const renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `请输入${title}!`
                }
              ],
              initialValue: record["content"][dataIndex]
            })(<Input />)}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  return <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>;
};

const EditableTable = observer(props => {
  const { commonStore } = useGlobalStores();
  const store = useStore();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = record => record.id === editingKey;

  const cancel = () => {
    setEditingKey("");
  };

  const save = (form, record) => {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const params = _.cloneDeep(record);
      params.content = row;
      store.upsertLang(params).then(res => {
        if (res.result) {
          message.success("修改成功");
          setEditingKey("");
          store.getLangList();
        }
      });
    });
  };

  const edit = key => {
    setEditingKey(key);
  };
  const ondelete = async id => {
    const { result } = await store.removeLang(id);
    if (result) {
      message.success("删除成功");
      store.getLangList();
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
        ondelete(id);
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };

  const components = {
    body: {
      cell: EditableCell
    }
  };
  const configColumns = () => {
    const columns = commonStore.languageList
      .filter(item => item.enable)
      .map(item => {
        let columnsItem;
        switch (item.lang) {
          default:
            columnsItem = {
              title: item.name,
              key: item.lang,
              dataIndex: item.lang,
              editable: true,
              render: (text, record, index) => (
                <span>{record["content"][item.lang]}</span>
              )
            };
        }
        return columnsItem;
      });
    return [
      ...[
        { title: "res_key", key: "resKey", dataIndex: "resKey" },
        { title: "模块", key: "productId", dataIndex: "productId" }
      ],
      ...columns,

      {
        title: "操作",
        key: "operation",
        dataIndex: "operation",
        render: (text, record) => {
          const editable = isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => save(form, record)}
                    style={{ marginRight: 8 }}
                  >
                    保存
                  </Button>
                )}
              </EditableContext.Consumer>

              <Button
                size="small"
                type="primary"
                onClick={() => cancel(record.id)}
              >
                取消
              </Button>
            </span>
          ) : (
            <span className={cs.operate_btn}>
              <Button
                size="small"
                type="primary"
                disabled={editingKey !== ""}
                onClick={() => edit(record.id)}
              >
                修改
              </Button>
              <Button
                size="small"
                type="danger"
                onClick={() => showDeleteConfirm(record.id)}
              >
                删除
              </Button>
            </span>
          );
        }
      }
    ];
  };
  const resetColumns = configColumns().map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => {
        return {
          record,
          inputType: "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record)
        };
      }
    };
  });
  return (
    <EditableContext.Provider value={props.form}>
      <Table
        components={components}
        bordered
        dataSource={store.langList}
        columns={resetColumns}
        rowClassName="editable-row"
        pagination={false}
        rowKey="id"
      />
    </EditableContext.Provider>
  );
});

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;
