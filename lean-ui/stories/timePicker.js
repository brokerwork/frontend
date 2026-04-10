import React from "react";
import TimePicker from "../components/TimePicker";
import { action } from "@storybook/addon-actions";
import Button from '../components/Button';

export default {
  chapters: [
    {
      sections: [
        {
          title: "时间选择器-三列",
          info: "time-picker",
          sectionFn: () => {
            const addon = () => {
              return <div>
                      <Button >
                        取消
                      </Button>
                      <Button type="primary" className="confirm-btn">
                        确定
                      </Button>
                    </div>
            }
            return (
                <div>
                  <div style={{marginBottom: 20}}>
                    <TimePicker addon={addon}/>
                  </div>
                  <div className="story-demo">
                    <TimePicker hourStep={2} minuteStep={10} showSecond={false}/>
                  </div>
                </div>
            );
          }
        }
      ]
    }
  ]
};
