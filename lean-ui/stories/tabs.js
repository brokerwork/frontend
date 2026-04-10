import React from "react";
import Tabs from "../components/Tabs";
import Icon from "../components/Icon";
const TabPane = Tabs.TabPane;
function callback(key) {
  console.log(key);
}
export default {
  chapters: [
    {
      sections: [
        {
          title: "Tabs",
          info: "标签页",
          sectionFn: () => {
            return (
              <div>
                <div className="story-demo">
                  <div>基本样式</div>
                  <br /><br />
                  <Tabs defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="Tab 1" key="1">Content of Tab Pane 1</TabPane>
                    <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
                    <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
                  </Tabs>
                </div>
                <br /><br />
                <div className="story-demo">
                  <div>卡片样式</div>
                  <Tabs onChange={callback} type="card">
                    <TabPane tab="Tab 1" key="1">Content of Tab Pane 1</TabPane>
                    <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
                    <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
                  </Tabs>
                </div>
                <br /><br />
                <div className="story-demo">
                  <div>卡片带icon</div>
                  <Tabs type="card">
                    <TabPane tab={<span><Icon icon="calender" />Tab 1</span>} key="1">
                      Tab 1
                    </TabPane>
                    <TabPane tab={<span>Tab 2</span>} key="2">
                      Tab 2
                    </TabPane>
                  </Tabs>
                </div>
              </div>
            );
          }
        }
      ]
    }
  ]
};