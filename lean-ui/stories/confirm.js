import React from "react";
import confirm from "../components/Dialog/confirm";
import { text, boolean, number } from "@storybook/addon-knobs/react";

export default {
  chapters: [
    {
      sections: [
        {
          title: "Dialog",
          info: "对话框",
          sectionFn: () => {
            confirm({
              title: "confirm title",
              content: "confirm content"
            });
            return null;
          }
        }
      ]
    }
  ]
};
