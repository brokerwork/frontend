import React from "react";
import Tooltip from "../components/Tooltip";

export default {
  chapters: [
    {
      sections: [
        {
          title: "tooltip",
          info: "文字提示",
          sectionFn: () => {
            return (
              <div>
                <h3>样式</h3>
                <div>
                  <div className="story-demo">
                    <Tooltip
                      trigger="click"
                      placement="topLeft"
                      title="Lorem ipsum dolor sit amet, do consectetur elit seddo eiusmod tempor incididunt ut labore doloremagna aliqua."
                    >
                      <span>Tooltip will show when mouse enter.</span>
                    </Tooltip>
                    <Tooltip
                      trigger="click"
                      placement="topLeft"
                      placement="right"
                      title="Lorem ipsum dolor sit amet, do consectetur elit seddo eiusmod tempor incididunt ut labore doloremagna aliqua."
                    >
                      <span>Tooltip will show when mouse enter.</span>
                    </Tooltip>
                  </div>
                </div>
              </div>
            );
          }
        }
      ]
    }
  ]
};
