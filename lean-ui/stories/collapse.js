import React from "react";
import Collapse from "../components/Collapse";
import {action} from "@storybook/addon-actions";

const Item = Collapse.Item

export default {
  chapters: [
    {
      sections: [
        {
          title: "",
          info: "",
          sectionFn: () => {
            return (
              <div>
                <h3>折叠面板</h3>
                <div className="story-demo">
                  <Collapse>
                    <Item title="this is panel title 1">this is panel content 1</Item>
                    <Item title="this is panel title 2">this is panel content 2</Item>
                    <Item title="this is panel title 3">this is panel content 3</Item>
                  </Collapse>
                </div>
                <h3>手风琴</h3>
                <div className="story-demo">
                  <Collapse accordion>
                    <Item title="this is panel title 1">this is panel content 1</Item>
                    <Item title="this is panel title 2">this is panel content 2</Item>
                    <Item title="this is panel title 3">this is panel content 3</Item>
                  </Collapse>
                </div>
                <h3>禁用</h3>
                <div className="story-demo">
                  <Collapse activeKey="1">
                    <Item title="this is panel title 1" disabled>this is panel content 1</Item>
                    <Item title="this is panel title 2" disabled>this is panel content 2</Item>
                  </Collapse>
                </div>
                <h3>强制全部展开</h3>
                <div className="story-demo">
                  <Collapse forceActiveAll={true}>
                    <Item title="this is panel title 1">this is panel content 1</Item>
                    <Item title="this is panel title 2">this is panel content 2</Item>
                  </Collapse>
                </div>
              </div>
            );
          }
        }
      ]
    }
  ]
};
