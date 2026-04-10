import * as React from "react";
import Notification from "rc-notification";
import Icon from "../Icon";

let defaultDuration = 3;
let defaultTop: number;
let messageInstance: any;
let key = 1;
let prefixCls = "lean-message";
let transitionName = "move-up";
let getContainer: () => HTMLElement;
const messageStore = new Map();

function getMessageInstance(callback: (i: any) => void) {
  if (messageInstance) {
    callback(messageInstance);
    return;
  }
  Notification.newInstance(
    {
      prefixCls,
      transitionName,
      style: { top: defaultTop }, // 覆盖原来的样式
      getContainer
    },
    (instance: any) => {
      if (messageInstance) {
        callback(messageInstance);
        return;
      }
      messageInstance = instance;
      callback(instance);
    }
  );
}

type NoticeType = "info" | "success" | "error" | "warning" | "loading";

function notice(
  content: React.ReactNode,
  options: any,
  type: NoticeType,
  onClose?: () => void
) {
  let iconType = {
    info: "info",
    success: "success",
    error: "error",
    warning: "warning",
    loading: "loading-outline"
  }[type];
  let closable: boolean = false;
  let duration: (() => void) | number = defaultDuration;
  let full: boolean = false;
  if (typeof options === "function") {
    onClose = options;
    duration = defaultDuration;
  } else if (typeof options === typeof true) {
    closable = options;
  } else if (typeof options === "object") {
    duration = options.duration;
    closable = options.closable;
    full = options.full;
  }
  if (closable) {
    duration = 0;
  }
  const msgKey = messageStore.get(content);
  let target: any;
  if (msgKey) {
    target = msgKey;
  } else {
    target = key++;
    messageStore.set(content, target);
  }
  // const target = msgKey ?  : key++;
  const closeIcon = closable ? (
    <a
      onClick={() => {
        messageInstance.removeNotice(target);
      }}
      className={`${prefixCls}-close-icon`}
    >
      <Icon icon="close" />
    </a>
  ) : null;
  getMessageInstance(instance => {
    instance.notice({
      key: target,
      duration,
      style: {},
      content: (
        <div
          className={`${prefixCls}-custom-content ${prefixCls}-${type} ${
            full ? `${prefixCls}-custom-content-full` : ""
          }`}
        >
          <Icon
            icon={iconType}
            className={`${prefixCls}-custom-content-icon`}
          />
          <span className={`${prefixCls}-custom-content-text`}>{content}</span>
          {closeIcon}
        </div>
      ),
      onClose: () => {
        messageStore.delete(content);
        if (onClose) onClose();
      }
      // closable
    });
  });
  return () => {
    if (messageInstance) {
      messageInstance.removeNotice(target);
    }
  };
}

type ConfigContent = React.ReactNode | string;
type ConfigDuration = ConfigOptions | number | (() => void) | boolean;
export type ConfigOnClose = () => void;
type ConfigClosable = boolean;

export interface ConfigOptions {
  top?: number;
  duration?: number;
  prefixCls?: string;
  getContainer?: () => HTMLElement;
  transitionName?: string;
  full?: boolean;
}

export default {
  info(
    content: ConfigContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose
  ) {
    return notice(content, duration, "info", onClose);
  },
  success(
    content: ConfigContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose
  ) {
    return notice(content, duration, "success", onClose);
  },
  error(
    content: ConfigContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose
  ) {
    return notice(content, duration, "error", onClose);
  },
  // Departed usage, please use warning()
  warn(
    content: ConfigContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose
  ) {
    return notice(content, duration, "warning", onClose);
  },
  warning(
    content: ConfigContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose
  ) {
    return notice(content, duration, "warning", onClose);
  },
  loading(
    content: ConfigContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose
  ) {
    return notice(content, duration, "loading", onClose);
  },
  config(options: ConfigOptions) {
    if (options.top !== undefined) {
      defaultTop = options.top;
      messageInstance = null; // delete messageInstance for new defaultTop
    }
    if (options.duration !== undefined) {
      defaultDuration = options.duration;
    }
    if (options.prefixCls !== undefined) {
      prefixCls = options.prefixCls;
    }
    if (options.getContainer !== undefined) {
      getContainer = options.getContainer;
    }
    if (options.transitionName !== undefined) {
      transitionName = options.transitionName;
      messageInstance = null; // delete messageInstance for new transitionName
    }
  },
  destroy() {
    if (messageInstance) {
      messageInstance.destroy();
      messageInstance = null;
    }
  }
};
