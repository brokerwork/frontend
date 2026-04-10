import React from "react";
import Button, { ButtonGroup } from "../components/Button";
import { action } from "@storybook/addon-actions";

export default {
  chapters: [
    {
      sections: [
        {
          title: "button primary",
          info: "主色按钮",
          sectionFn: () => {
            return (
              <div>
                <h3>样式</h3>
                <div>
                  <div className="story-demo">
                    <Button
                      onClick={action("clicked")}
                      type="default"
                      ref="123"
                    >
                      Button
                    </Button>
                    <Button
                      onClick={action("clicked")}
                      className="hover"
                      type="default"
                    >
                      Button hover
                    </Button>
                    <Button
                      onClick={action("clicked")}
                      className="focus"
                      type="default"
                    >
                      Button focus
                    </Button>
                    <Button
                      onClick={action("clicked")}
                      className="active"
                      type="default"
                    >
                      Button active
                    </Button>
                    <Button onClick={action("clicked")} disabled type="default">
                      Button disabled
                    </Button>
                  </div>
                  <div className="story-demo">
                    <Button onClick={action("clicked")} type="primary">
                      Button
                    </Button>
                    <Button
                      onClick={action("clicked")}
                      className="hover"
                      type="primary"
                    >
                      Button hover
                    </Button>
                    <Button
                      onClick={action("clicked")}
                      className="focus"
                      type="primary"
                    >
                      Button focus
                    </Button>
                    <Button
                      onClick={action("clicked")}
                      className="active"
                      type="primary"
                    >
                      Button active
                    </Button>
                    <Button onClick={action("clicked")} disabled type="primary">
                      Button disabled
                    </Button>
                  </div>
                  <div className="story-demo">
                    <Button onClick={action("clicked")} type="success">
                      Button
                    </Button>
                    <Button
                      onClick={action("clicked")}
                      className="hover"
                      type="success"
                    >
                      Button hover
                    </Button>
                    <Button
                      onClick={action("clicked")}
                      className="focus"
                      type="success"
                    >
                      Button focus
                    </Button>
                    <Button
                      onClick={action("clicked")}
                      className="active"
                      type="success"
                    >
                      Button active
                    </Button>
                    <Button onClick={action("clicked")} disabled type="success">
                      Button disabled
                    </Button>
                  </div>
                  <div className="story-demo">
                    <Button onClick={action("clicked")} type="danger">
                      Button
                    </Button>
                    <Button
                      onClick={action("clicked")}
                      className="hover"
                      type="danger"
                    >
                      Button hover
                    </Button>
                    <Button
                      onClick={action("clicked")}
                      className="focus"
                      type="danger"
                    >
                      Button focus
                    </Button>
                    <Button
                      onClick={action("clicked")}
                      className="active"
                      type="danger"
                    >
                      Button active
                    </Button>
                    <Button onClick={action("clicked")} disabled type="danger">
                      Button disabled
                    </Button>
                  </div>
                </div>
                <h3>尺寸</h3>
                <div className="story-demo">
                  <Button type="primary" size="small">
                    small
                  </Button>
                  <Button type="primary">Default</Button>
                  <Button type="primary" size="large">
                    Large
                  </Button>
                </div>
                <h3>图标按钮</h3>
                <div className="story-demo">
                  <Button type="default" size="small" icon="filter-soild" />
                  <Button type="default" icon="filter-soild" />
                  <Button type="default" size="large" icon="filter-soild" />
                </div>
              </div>
            );
          }
        }
      ]
    }
  ]
};
