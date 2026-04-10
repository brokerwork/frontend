import React from "react";
import Alert from "../components/Alert";
import { action } from "@storybook/addon-actions";

const notLastOptions = {
  showSource: false,
  allowSourceToggling: true,
  showPropTables: false,
  allowPropTablesToggling: false
};


export default {
  chapters: [
    {
      sections: [
        {
          title: "基本使用",
          info: "主色按钮",
          options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-demo slert-demo">
                <Alert
                  message="Success Description Success Description Success Description Success Description"
                  type="success"
                />
                <br />
                <Alert
                  message="Info Description Info Description Info Description Info Description"
                  type="info"
                />
                <br />
                <Alert
                  message="Warning Description Warning Description Warning Description Warning Description"
                  type="warning"
                />
                <br />
                <Alert
                  message="Error Description Error Description Error Description Error Description"
                  type="error"
                />
              </div>
            );
          }
        },
        {
          title: "不需要icon",
          info: "设置**showIcon={false}** 来隐藏icon",
          options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-demo slert-demo">
                <Alert showIcon={false} message="Success " type="success" />
                <br />
                <Alert showIcon={false} message="Info" type="info" />
                <br />
                <Alert showIcon={false} message="Warning" type="warning" />
                <br />
                <Alert showIcon={false} message="Error" type="error" />
              </div>
            );
          }
        },
        {
          title: "自定义icon",         
          sectionFn: () => {
            return (
              <div className="story-demo slert-demo">
                <Alert message="Success " type="success" iconType="bell" />
                <br />
                <Alert message="Warning " type="warning" iconType="chatdots" />
              </div>
            );
          }
        }
      ]
    }
  ]
};
