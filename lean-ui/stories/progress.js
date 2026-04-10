import React from "react";
import Progress from "../components/Progress";

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
                <h3>进度条</h3>
                <div className="story-demo" style={{ width: 170 }}>
                <Progress percent={30} size="small" />
                <Progress percent={50} size="small" status="active" />
                <Progress percent={70} size="small" status="exception" />
                <Progress percent={100} size="small" />
                </div>

                <h3>仪表盘进度条</h3>
                <div>
                <Progress type="circle" percent={30} width={80} />
                <Progress type="circle" percent={70} width={80} status="exception" />
                <Progress type="circle" percent={100} width={80} />
                </div>
              </div>
            )
          }
        }
      ]
    }
  ]
}
