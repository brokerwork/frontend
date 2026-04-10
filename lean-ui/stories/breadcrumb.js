import React from "react";
import Breadcrumb, {Item} from "../components/Breadcrumb";
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
          title: "基本",
          options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-demo badge-demo">
                <Breadcrumb>
                    <Breadcrumb.Item><a href="#">HOME</a></Breadcrumb.Item>
                    <Breadcrumb.Item><a href="#">CUSTOMER</a></Breadcrumb.Item>
                    <Breadcrumb.Item>DETAIL</Breadcrumb.Item>
                </Breadcrumb>
              </div>
            );
          }
        },
        {
          title: "结合router使用",
          info: "参考ant-design文档使用， [https://ant.design/components/breadcrumb-cn/](https://ant.design/components/breadcrumb-cn/)",
          // options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-demo badge-demo">
                <Breadcrumb>
                    <Breadcrumb.Item><a href="#">HOME</a></Breadcrumb.Item>
                    <Breadcrumb.Item><a href="#">CUSTOMER</a></Breadcrumb.Item>
                    <Breadcrumb.Item>DETAIL</Breadcrumb.Item>
                </Breadcrumb>
              </div>
            );
          }
        }
      ]
    }
  ]
};
