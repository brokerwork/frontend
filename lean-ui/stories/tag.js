import React from "react";
import Tag from "../components/Tag";
import { action } from "@storybook/addon-actions";

export default {
  chapters: [
    {
      sections: [
        {
          title: "Tag",
          info: "标签",
          sectionFn: () => {
            return (
              <div>
                <h3>多彩标签</h3>
                <div className="sotry-demo">
                  <Tag color="red">标签1</Tag>
                  <Tag color="orange">标签1</Tag>
                  <Tag color="yellow">标签1</Tag>
                  <Tag color="green">标签1</Tag>
                  <Tag color="blue">标签1</Tag>
                  <Tag color="pink">标签1</Tag>
                  <Tag color="grey">标签1</Tag>
                  <Tag color="default">标签1</Tag>
                </div>
                <h3>可关闭标签</h3>
                <div className="sotry-demo">
                  <Tag
                    closeable
                    onCloseClick={action("clicked1231")}
                    color="red"
                  >
                    标签1
                  </Tag>
                  <Tag
                    closeable
                    onCloseClick={action("clicked")}
                    color="orange"
                  >
                    标签1
                  </Tag>
                  <Tag
                    closeable
                    onCloseClick={action("clicked")}
                    color="yellow"
                  >
                    标签1
                  </Tag>
                  <Tag closeable onCloseClick={action("clicked")} color="green">
                    标签1
                  </Tag>
                  <Tag closeable onCloseClick={action("clicked")} color="blue">
                    标签1
                  </Tag>
                  <Tag closeable onCloseClick={action("clicked")} color="pink">
                    标签1
                  </Tag>
                  <Tag closeable onCloseClick={action("clicked")} color="grey">
                    标签1
                  </Tag>
                  <Tag
                    closeable
                    onCloseClick={action("clicked")}
                    color="default"
                  >
                    标签1
                  </Tag>
                </div>
                <h3>添加标签</h3>
                <div className="sotry-demo">
                  <Tag closeable onCloseClick={action("clicked")} color="red">
                    标签1
                  </Tag>
                  <Tag newTag color="orange">
                    New Tag
                  </Tag>
                </div>
              </div>
            );
          }
        }
      ]
    }
  ]
};
