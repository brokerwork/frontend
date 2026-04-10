import * as React from "react";
import * as ReactDOM from "react-dom";
import * as classNames from "classnames";
import Icon from "../Icon";
import Dialog, { ModalFuncProps } from "./Modal";

interface ConfirmDialogProps extends ModalFuncProps {
  afterClose?: () => void;
  close: (...args: any[]) => void;
}

const IS_REACT_16 = !!ReactDOM.createPortal;

const ConfirmDialog = (props: ConfirmDialogProps) => {
  const { onCancel, onOk, close, zIndex, afterClose, visible } = props;
  const iconType = props.iconType || "question-circle";
  const okType = props.okType || "primary";
  const prefixCls = props.prefixCls || "lean-confirm";
  // 默认为 true，保持向下兼容
  const okCancel = "okCancel" in props ? props.okCancel! : true;
  const width = props.width || 416;
  const style = props.style || {};
  // 默认为 false，保持旧版默认行为
  const maskClosable =
    props.maskClosable === undefined ? false : props.maskClosable;
  const okText = props.okText || "ok";
  const cancelText = props.cancelText || "cancel";

  const classString = classNames(
    prefixCls,
    `${prefixCls}-${props.type}`,
    props.className
  );

  return (
    <Dialog
      className={classString}
      onCancel={close.bind(this, { triggerCancel: true })}
      cancelText={cancelText}
      onOk={onOk}
      okText={okText}
      okType={okType}
      visible={visible}
      title={props.title}
      transitionName="zoom"
      maskTransitionName="fade"
      maskClosable={maskClosable}
      style={style}
      width={width}
      zIndex={zIndex}
      afterClose={afterClose}
    >
      <Icon icon={iconType!} />
      <div className={`${prefixCls}-content`}>{props.content}</div>
    </Dialog>
  );
};

export default function confirm(config: ModalFuncProps) {
  let div = document.createElement("div");
  document.body.appendChild(div);

  function close(...args: any[]) {
    if (IS_REACT_16) {
      render({
        ...config,
        close,
        visible: false,
        afterClose: destroy.bind(this, ...args)
      });
    } else {
      destroy(...args);
    }
  }

  function destroy(...args: any[]) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
    const triggerCancel =
      args && args.length && args.some(param => param && param.triggerCancel);
    if (config.onCancel && triggerCancel) {
      config.onCancel(...args);
    }
  }

  function render(props: any) {
    ReactDOM.render(<ConfirmDialog {...props} />, div);
  }

  render({ ...config, visible: true, close });

  return {
    destroy: close
  };
}
