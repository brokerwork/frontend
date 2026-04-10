import React from "react";
import Notification from "../components/Notification";
import Button from "../components/Button";

const close = (key) => {
  Notification.close(key);
};
const openNotification = () => {
  const key = `open${Date.now()}`;
  const args = {
    message: "提示主题",
    description:
      "消息详情消息提示详情",
    duration: 100,
    closeName: '关闭',
    checkName: '查看',
    key: key,
    onClose: close.bind(this, key)
  };
  Notification.open(args);
};
export default {
  chapters: [
    {
      sections: [
        {
          title: "notification",
          info: "国际化需要传入［closeName］,[checkName]的code,如不传入［closeName］则默认为没有关闭按钮。只有查看按钮",
          sectionFn: () => {
            return (
              <div>
                <div className="story-demo">
                  <Button
                    type="primary"
                    onClick={() => {
                      openNotification();
                    }}
                  >
                    Open the notification box
                  </Button>
                </div>
              </div>
            );
          }
        }
      ]
    }
  ]
};
