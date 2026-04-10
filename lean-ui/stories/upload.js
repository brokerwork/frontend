import React from "react";
import Upload from "../components/Upload";
import { action } from "@storybook/addon-actions";

export default {
  chapters: [
    {
      sections: [
        {
          title: "上传 图片",
          info: "上传文件",
          sectionFn: () => {
            return (
              <div>
                <Upload
                  maxLength={3}
                  maxSize={3}
                  maxWidth={20000}
                  maxHeight={10000}
                  notify={() => {
                    alert("过大");
                  }}
                  onChange={() => {
                    console.log("chage");
                  }}
                  onRemove={index => {
                    console.log(index);
                  }}
                  disabled={false}
                  accept="image/jpg,image/png,.pdf"
                  multiple={true}
                  srcList={[
                    {
                      src:
                        "http://broker-upload-dev.oss-cn-hangzhou.aliyuncs.com/test/T001117/437_d153a820-a45b-11e8-bc64-fd7ea13bca26.jpg",
                      name: "",
                      progress: 100
                    },
                    {
                      src:
                        "http://broker-upload-dev.oss-cn-hangzhou.aliyuncs.com/test/T001117/发票-9363309_727412f0-56c0-11e9-b7a0-7b9fc57ab517.pdf",
                      name: "",
                      progress: 100
                    }
                  ]}
                >
                  上传
                </Upload>
                <Upload
                  maxLength={3}
                  maxSize={3}
                  maxWidth={20000}
                  maxHeight={10000}
                  notify={() => {
                    alert("过大");
                  }}
                  onChange={() => {
                    console.log("chage");
                  }}
                  onRemove={index => {
                    console.log(index);
                  }}
                  disabled={false}
                  accept="image/jpg,image/png,.pdf"
                  multiple={true}
                  srcList={[
                    {
                      src:
                        "http://broker-upload-dev.oss-cn-hangzhou.aliyuncs.com/test/T001117/437_d153a820-a45b-11e8-bc64-fd7ea13bca26.jpg",
                      name: "",
                      progress: 100
                    }
                  ]}
                >
                  上传2
                </Upload>
                <Upload
                  action="http://trader.tamsc.lwork.com/api/ali/oss/signature?bucket=leanwork-fs&fid=T001117/3ebb9fd1-2784-11e8-b428-ef02b99f1a6c"
                  type="drag"
                  srcList={[
                    {
                      src:
                        "http://broker-upload-dev.oss-cn-hangzhou.aliyuncs.com/test/T001117/437_d153a820-a45b-11e8-bc64-fd7ea13bca26.jpg",
                      name: "",
                      progress: 100
                    }
                  ]}
                >
                  Upload
                </Upload>
              </div>
            );
          }
        }
      ]
    }
  ]
};
