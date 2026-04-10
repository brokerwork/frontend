import React from "react";
import Dialog from "../components/Dialog";
import Button from "../components/Button";
import { text, boolean, number } from '@storybook/addon-knobs/react';

export default {
  chapters: [
    {
      sections: [
        {
          title: "Dialog",
          info: "对话框",
          sectionFn: () => {
            return (
              <div>
                <div>
                  <div className="story-demo">
                  <Dialog
                    title="Basic Modal"
                    visible={boolean('show', true)}
                    align={text('align', 'center')}
                  >
                    <div>Some contents...</div>
                    <div>Some contents...</div>
                    <div>Some contents...</div>
                  </Dialog>
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