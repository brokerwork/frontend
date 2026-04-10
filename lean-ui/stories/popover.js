import React from "react";
import Popover from "../components/Popover";
import Icon from "../components/Icon";
import Button from "../components/Button";
const buttonWidth = 70;
const text = <span>Title</span>;
const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

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
                    <Popover
                      placement="topLeft"
                      trigger="click"
                      content="Lorem ipsum dolor sit amet, do consectetur elit seddo eiusmod tempor incididunt ut labore doloremagna aliqua."
                    >
                      <span>Popover will show when mouse enter.</span>
                    </Popover>
                  </div>
                </div>
                <h3>方位</h3>
                <div className="demo" style={{marginLeft: '300px'}}>
                  <div style={{ marginLeft: buttonWidth, whiteSpace: 'nowrap' }}>
                    <Popover placement="topLeft" title={text} content={content} trigger="click">
                      <Button>TL</Button>
                    </Popover>
                    <Popover placement="top" title={text} content={content} trigger="click">
                      <Button>Top</Button>
                    </Popover>
                    <Popover placement="topRight" title={text} content={content} trigger="click">
                      <Button>TR</Button>
                    </Popover>
                  </div>
                  <div style={{ width: buttonWidth, float: 'left' }}>
                    <Popover placement="leftTop" title={text} content={content} trigger="click">
                      <Button>LT</Button>
                    </Popover>
                    <Popover placement="left" title={text} content={content} trigger="click">
                      <Button>Left</Button>
                    </Popover>
                    <Popover placement="leftBottom" title={text} content={content} trigger="click">
                      <Button>LB</Button>
                    </Popover>
                  </div>
                  <div style={{ width: buttonWidth, marginLeft: (buttonWidth * 4) + 24 }}>
                    <Popover placement="rightTop" title={text} content={content} trigger="click">
                      <Button>RT</Button>
                    </Popover>
                    <Popover placement="right" title={text} content={content} trigger="click">
                      <Button>Right</Button>
                    </Popover>
                    <Popover placement="rightBottom" title={text} content={content} trigger="click">
                      <Button>RB</Button>
                    </Popover>
                  </div>
                  <div style={{ marginLeft: buttonWidth, clear: 'both', whiteSpace: 'nowrap' }}>
                    <Popover placement="bottomLeft" title={text} content={content} trigger="click">
                      <Button>BL</Button>
                    </Popover>
                    <Popover placement="bottom" title={text} content={content} trigger="click">
                      <Button>Bottom</Button>
                    </Popover>
                    <Popover placement="bottomRight" title={text} content={content} trigger="click">
                      <Button>BR</Button>
                    </Popover>
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
