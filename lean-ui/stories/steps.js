import React from "react";
import Steps from "../components/Steps";
const Step = Steps.Step;
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
                <div className="story-demo">
                  <Steps current={1}>
                    <Step title="Finished" />
                    <Step title="In Progress" />
                    <Step title="Waiting" />
                  </Steps>
                </div>
                <div className="story-demo" style={{marginTop: '20px'}}>
                  <Steps current={1} status="error">
                    <Step title="Finished" />
                    <Step title="In Progress" />
                    <Step title="Waiting" />
                  </Steps>
                </div>
              </div>
            );
          }
        }
      ]
    }
  ]
};
