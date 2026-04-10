import React from "react";
import Icon from "../components/Icon";
const fontsJson = require("../LeanWork-Icons/selection.json");
const iconNames = fontsJson.icons.map(item => {
  return item.properties.name.replace("lw-", "");
});

export default {
  chapters: [
    {
      sections: [
        {
          title: "icon",
          info: "图标",
          sectionFn: () => {
            return (
              <div className="sotry-icon-demo">
                {iconNames.map((item, index) => {
                  return (
                    <div className="sotry-icon-demo-item" key={index}>
                      <div className="sotry-icon-demo-icon">
                        <Icon icon={item} />
                      </div>
                      <div className="sotry-icon-demo-name">{item}</div>
                    </div>
                  );
                })}
              </div>
            );
          }
        },
        {
          title: "bw-icon",
          info: "bw图标",
          sectionFn: () => {
            return (
              <div className="sotry-icon-demo">
                <Icon fontType="bw" icon="account-color" />
                <Icon fontType="bw" icon="account" />
              </div>
            );
          }
        }
      ]
    }
  ]
};
