import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "src/utils/provider.js";
import { Checkbox, Button, Upload, Icon, message } from "antd";
import cs from "./index.less";
import { useGlobalStores } from "src/hooks/useGlobalStores";
import _ from "lodash";
import qs from "qs";
const Root = observer(() => {
  const store = useStore();
  const { commonStore } = useGlobalStores();
  const [fileData, setFileData] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [langs, setLangs] = useState([]);
  const onChange = value => {
    setLangs(value);
  };
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", fileData);
    setUploading(true);
    const { result } = await store.uploadFile(formData);
    if (result) {
      message.success("上传成功");
      setUploading(false);
    }
  };
  const handleExport = () => {
    if (!langs.length) {
      message.warning("请至少选择一种导出语言");
      return;
    }
    const a = document.createElement("a");
    const href = `/v1/i18/download?${qs.stringify(
      { langs: langs },
      { arrayFormat: "repeat" }
    )}`;
    a.setAttribute("href", href);
    a.setAttribute("download", true);
    a.click();
  };
  const uploadProps = {
    onRemove: file => {
      setFileData(null);
    },
    beforeUpload: file => {
      setFileData(file);
      return false;
    },
    onChange: info => {
      let fileList = [...info.fileList];
      fileList = fileList.slice(-1);
      fileList = fileList.map(file => {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.url;
        }
        return file;
      });
      setFileList(fileList);
    },
    fileList
  };
  return (
    <div>
      <div className={cs.item_container}>
        <h2>批量导出：</h2>
        <p>请选择需要导出的语言</p>
        <div>
          <Checkbox.Group
            options={commonStore.languageList.map(lang => ({
              label: lang.name,
              value: lang.lang
            }))}
            value={langs}
            onChange={onChange}
          />
        </div>
        <div className={cs.btn_area}>
          <Button type="primary" onClick={handleExport}>
            导出
          </Button>
          {/* <a
            className="ant-btn ant-btn-primary"
            download
            href={`/v1/i18/download?${qs.stringify(
              { langs: langs },
              { arrayFormat: "repeat" }
            )}`}
          >
            导出
          </a> */}
        </div>
      </div>
      <div className={cs.item_container}>
        <h2>
          批量导入：
          <strong>如果仅需导入一种语言，请删除其他类型的语言列</strong>
        </h2>
        <div className={cs.import_btn_area}>
          <div className={cs.upload_btn}>
            <Upload {...uploadProps}>
              <Button type="primary">
                <Icon type="upload" /> 选择文件
              </Button>
            </Upload>
          </div>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={!fileData}
            loading={uploading}
          >
            导入
          </Button>
        </div>
      </div>
    </div>
  );
});

export default Root;
