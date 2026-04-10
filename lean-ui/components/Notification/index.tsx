import * as React from "react";
import Notification from "rc-notification";
import Icon from "../Icon";

export type NotificationPlacement =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

const notificationInstance: { [key: string]: any } = {};
let defaultDuration = 4.5;
let defaultTop = 24;
let defaultBottom = 24;
let defaultPlacement: NotificationPlacement = "topRight";
let defaultGetContainer: () => HTMLElement;

export interface ConfigProps {
  top?: number;
  bottom?: number;
  duration?: number;
  placement?: NotificationPlacement;
  getContainer?: () => HTMLElement;
}
function setNotificationConfig(options: ConfigProps) {
  const { duration, placement, bottom, top, getContainer } = options;
  if (duration !== undefined) {
    defaultDuration = duration;
  }
  if (placement !== undefined) {
    defaultPlacement = placement;
  }
  if (bottom !== undefined) {
    defaultBottom = bottom;
  }
  if (top !== undefined) {
    defaultTop = top;
  }
  if (getContainer !== undefined) {
    defaultGetContainer = getContainer;
  }
}

function getPlacementStyle(placement: NotificationPlacement) {
  let style;
  switch (placement) {
    case "topLeft":
      style = {
        left: 0,
        top: defaultTop,
        bottom: "auto"
      };
      break;
    case "topRight":
      style = {
        right: 0,
        top: defaultTop,
        bottom: "auto"
      };
      break;
    case "bottomLeft":
      style = {
        left: 0,
        top: "auto",
        bottom: defaultBottom
      };
      break;
    default:
      style = {
        right: 0,
        top: "auto",
        bottom: defaultBottom
      };
      break;
  }
  return style;
}

function getNotificationInstance(
  prefixCls: string,
  placement: NotificationPlacement,
  callback: (n: any) => void
) {
  const cacheKey = `${prefixCls}-${placement}`;
  if (notificationInstance[cacheKey]) {
    callback(notificationInstance[cacheKey]);
    return;
  }
  (Notification as any).newInstance(
    {
      prefixCls,
      className: `${prefixCls}-${placement}`,
      style: getPlacementStyle(placement),
      getContainer: defaultGetContainer
    },
    (notification: any) => {
      notificationInstance[cacheKey] = notification;
      callback(notification);
    }
  );
}

export interface ArgsProps {
  message: React.ReactNode;
  description: React.ReactNode;
  closeName: string;
  checkName: string;
  key?: string;
  onClose?: () => void;
  duration?: number | null;
  placement?: NotificationPlacement;
  style?: React.CSSProperties;
  prefixCls?: string;
  className?: string;
}
function notice(args: ArgsProps) {
  const outerPrefixCls = args.prefixCls || "lean-notification";
  const prefixCls = `${outerPrefixCls}-notice`;
  const duration =
    args.duration === undefined ? defaultDuration : args.duration;

  let iconNode: React.ReactNode = null;
  iconNode = (
    <Icon
      className={`${prefixCls}-icon ${prefixCls}-icon-info`}
      icon='notification-color'
    />
  );

  const autoMarginTag =
    !args.description && iconNode ? (
      <span className={`${prefixCls}-message-single-line-auto-margin`} />
    ) : null;
  const defaultClose = () => {
    api.close(args.key);
  };
  getNotificationInstance(
    outerPrefixCls,
    args.placement || defaultPlacement,
    (notification: any) => {
      notification.notice({
        content: (
          <div className={iconNode ? `${prefixCls}-with-icon` : ""}>
            {iconNode}
            <div className={`${prefixCls}-content`}>
              <div className={`${prefixCls}-message`}>
                {autoMarginTag}
                {args.message}
              </div>
              <div className={`${prefixCls}-description`}>{args.description}</div>
            </div>
            {args.closeName ?
              (<div className={`${prefixCls}-btn-area`}>
                <div className={`${prefixCls}-btn-close`} onClick={defaultClose}>{args.closeName}</div>
                <div className={`${prefixCls}-btn-check`} onClick={args.onClose}>{args.checkName}</div>
              </div>)
             : <div className={`${prefixCls}-btn-full-check`} onClick={args.onClose}>{args.checkName}</div>
            }
          </div>
        ),
        duration,
        // closable: true,
        onClose: args.onClose,
        key: args.key,
        style: args.style || {},
        className: args.className
      });
    }
  );
}

const api: any = {
  open: notice,
  close(key: string) {
    Object.keys(notificationInstance).forEach(cacheKey =>
      notificationInstance[cacheKey].removeNotice(key)
    );
  },
  config: setNotificationConfig,
  destroy() {
    Object.keys(notificationInstance).forEach(cacheKey => {
      notificationInstance[cacheKey].destroy();
      delete notificationInstance[cacheKey];
    });
  }
};

export interface NotificationApi {
  open(args: ArgsProps): void;
  close(key: string): void;
  config(options: ConfigProps): void;
  destroy(): void;
}
export default api as NotificationApi;
