import React from "react";
import Switch from "../components/Switch";
import Pagination from "../components/Pagination";
import Icon from "../components/Icon";
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
          options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-panel">
                <Pagination defaultCurrent={1} total={500} />
                <br/>
                <Pagination defaultCurrent={1} total={500} showQuickJumper showSizeChanger/>

              </div>
            );
          }
        },
        {
          title: "快速跳转",
          options: notLastOptions,
          info: "**showQuickJumper** 开启快速跳转",
          sectionFn: () => {
            return (
              <div className="story-panel">
                <Pagination
                  defaultCurrent={1}
                  total={500}
                  showQuickJumper
                />
              </div>
            );
          }
        },
        {
          title: "修改每页显示条数",
          info: "select 完成后实现",
          options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-panel">
                <Pagination
                  defaultCurrent={1}
                  total={500}
                  showSizeChanger
                  // 自定义默认显示数量
                  pageSize={100}
                  onShowSizeChange={(current, pageSize) => {
                    console.log(current, pageSize);
                  }}
                />
              </div>
            );
          }
        },
        {
          title: "图标按钮 + 松散排列",
          options: notLastOptions,
          info: "**iconJumper** 设置以图标代替上一页下一页， **looseStyle** 以松散风格显示",
          sectionFn: () => {
            return (
              <div className="story-panel">
                <Pagination
                  defaultCurrent={1}
                  total={50}
                  looseStyle
                  iconJumper
                />
              </div>
            );
          }
        },
        {
          title: "单页配置",
          info: "**hideOnSinglePage** 设置只有一页是是否显示",
          options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-panel">
                <Pagination defaultCurrent={1} total={4} iconJumper hideOnSinglePage />
                <br/>
                <Pagination defaultCurrent={1} total={4} iconJumper />
              </div>
            );
          }
        },
        {
          title: "图标按钮",
          options: notLastOptions,
          info: "**iconJumper** 设置以图标代替上一页下一页",

          sectionFn: () => {
            return (
              <div className="story-panel">
                <Pagination defaultCurrent={1} total={500} iconJumper />
              </div>
            );
          }
        },
        {
          title: "松散排列",
          options: notLastOptions,
          info: "**looseStyle** 以松散风格显示",

          sectionFn: () => {
            return (
              <div className="story-panel">
                <Pagination defaultCurrent={1} total={500} looseStyle />
              </div>
            );
          }
        },
        {
          title: "显示总数",
          options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-panel">
                <Pagination
                  defaultCurrent={1}
                  total={500}
                  showTotal={(total, range) => (
                    <div>
                      {range[0]} ~ {range[1]}，共{total}条
                    </div>
                  )}
                />
              </div>
            );
          }
        },
        {
          title: "左对齐",
          sectionFn: () => {
            return (
              <div className="story-panel">
                <Pagination
                  defaultCurrent={1}
                  total={500}
                  align="left"
                />
                <br/>
                <Pagination defaultCurrent={1} total={500} align="left" showQuickJumper showSizeChanger/>
              </div>
            );
          }
        }
      ]
    }
  ]
};
