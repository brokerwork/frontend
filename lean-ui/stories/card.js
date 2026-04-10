import React from "react";
import Card from "../components/Card";
const class1 = {
	width:'800px',
	height:'400px',
	textAlign:'center',
}
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
                <h3>经典卡片</h3>
                <div className="story-demo">
					<Card title="Card Title" extra={<a href="#">Button</a>} style={{width:'400px'}}>Card content</Card>
                </div>
                <h3>简洁卡片（只包含内容区域）</h3>
                <div className="story-demo">
					<Card style={{width:'400px'}}>
						Card content<br/>
						Card content<br/>
						Card content
					</Card>
                </div>
              </div>
            )
          }
        }
      ]
    }
  ]
}
