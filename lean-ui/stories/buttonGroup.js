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
                <h3>按钮组</h3>
                <div className="story-btn-group-demo">
                  <ButtonGroup>
                    <Button type="default">Button 1</Button>
                    <Button type="default">Button 2</Button>
                    <Button type="default">Button 3</Button>
                    <Button type="default">Button 4</Button>
                    <Button type="default">Button 5</Button>
                    <Button type="default">Button 6</Button>
                  </ButtonGroup>
                </div>
                <h3>图标按钮组</h3>
                <div className="story-btn-group-demo">
                  <ButtonGroup>
                    <Button type="default" icon="filter-soild" />
                    <Button type="default" icon="email" />
                    <Button type="default" icon="delete" />
                  </ButtonGroup>
                </div>
              </div>
            );
          }
        }
      ]
    }
  ]
};
