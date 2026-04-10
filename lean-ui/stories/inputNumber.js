import React from "react"
import InputNumber from "../components/InputNumber"
import Icon from "../components/Icon"
import { action } from "@storybook/addon-actions"

export default {
  chapters: [
    {
      sections: [
        {
          title: "inputNumber 数字输入框",
          info: "数字输入框",
          sectionFn: () => {
            return (
              <div className="story-panel">
                <div className="story-input-number">
                  <InputNumber step={0.1} min={1} max={10} placeholder='手动输入数字'/>  
                </div>
                <div className="story-input-number">
                  <InputNumber placeholder="small" size="small" step={0.2} min={1} max={10} />  
                </div>
                <div className="story-input-number">
                  <InputNumber placeholder="large" size="large" step={0.3} min={1} max={10} />  
                </div>
                <div className="story-input-number">
                  <InputNumber defaultValue={123} precision={2} min={1} max={1000} />  
                </div>
                <div className="story-input-number">
                  <InputNumber formatter={val => `${val}%`} defaultValue={100} min={1} max={1000} />  
                </div>
                <div className="story-input-number">
                  <InputNumber formatter={val => `$${val}`} precision={2} step={0.1} defaultValue={100} min={1} max={1000} />  
                </div>
              </div>
            )
          }
        }
      ]
    }
  ]
}
