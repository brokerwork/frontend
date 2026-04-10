import * as React from "react";
import Dialog from "rc-dialog";
import * as PropTypes from "prop-types";
import * as addEventListener from "rc-util/lib/Dom/addEventListener";
import Button from "../Button";
import { ButtonType } from "../Button";
import * as classNames from "classnames";

let mousePosition: { x: number; y: number } | null;
let mousePositionEventBinded: boolean;

export interface ModalProps {
  /** 对话框是否可见*/
  visible?: boolean;
  /** 标题*/
  title?: React.ReactNode | string;
  /** 是否显示右上角的关闭按钮*/
  closable?: boolean;
  /** 点击确定回调*/
  onOk?: (e?: React.MouseEvent<any>) => void;
  /** 点击模态框右上角叉、取消按钮、Props.maskClosable 值为 true 时的遮罩层或键盘按下 Esc 时的回调*/
  onCancel?: (e?: React.MouseEvent<any>) => void;
  afterClose?: () => void;
  /** 宽度*/
  width?: string | number;
  /** 底部内容*/
  footer?: React.ReactNode;
  /** 确认按钮文字*/
  okText?: string;
  /** 确认按钮类型*/
  okType?: ButtonType;
  /** 取消按钮文字*/
  cancelText?: string;
  /** 点击蒙层是否允许关闭*/
  maskClosable?: boolean;
  align?: string;
  destroyOnClose?: boolean;
  style?: React.CSSProperties;
  wrapClassName?: string;
  maskTransitionName?: string;
  transitionName?: string;
  className?: string;
  getContainer?: (instance: React.ReactInstance) => HTMLElement;
  zIndex?: number;
  bodyStyle?: React.CSSProperties;
  maskStyle?: React.CSSProperties;
  mask?: boolean;
  drag?: boolean;
}

export interface ModalFuncProps {
  prefixCls?: string;
  className?: string;
  visible?: boolean;
  title?: React.ReactNode;
  content?: React.ReactNode;
  onOk?: (...args: any[]) => any | PromiseLike<any>;
  onCancel?: (...args: any[]) => any | PromiseLike<any>;
  width?: string | number;
  iconClassName?: string;
  okText?: string;
  okType?: ButtonType;
  cancelText?: string;
  iconType?: string;
  maskClosable?: boolean;
  zIndex?: number;
  okCancel?: boolean;
  style?: React.CSSProperties;
  type?: string;
  drag?: boolean;
}

export type ModalFunc = (
  props: ModalFuncProps
) => {
  destroy: () => void;
};

export interface ModalLocale {
  okText: string;
  cancelText: string;
  justOkText: string;
}

export default class Modal extends React.Component<ModalProps, {}> {
  static info: ModalFunc;
  static success: ModalFunc;
  static error: ModalFunc;
  static warn: ModalFunc;
  static warning: ModalFunc;
  static confirm: ModalFunc;

  static defaultProps = {
    prefixCls: "lean-modal",
    width: 520,
    transitionName: "move-up",
    maskTransitionName: "fade",
    visible: false,
    okType: "primary"
  };

  static propTypes = {
    prefixCls: PropTypes.string,
    /** ok 回调 */
    onOk: PropTypes.func,
    /** cancel 回调 */
    onCancel: PropTypes.func,
    /** ok 文本 */
    okText: PropTypes.node,
    /** cancel 文本 */
    cancelText: PropTypes.node,
    /** 宽度 */
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    visible: PropTypes.bool,
    /** 对齐方式，默认左对齐。居中 center */
    align: PropTypes.string,
    /** 底部内容*/
    footer: PropTypes.node,
    /** 标题 */
    title: PropTypes.node,
    /** 禁用关闭 */
    closable: PropTypes.bool,
    /** 是否可拖拽 */
    drag: PropTypes.bool
  };

  handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    const onCancel = this.props.onCancel;
    if (onCancel) {
      onCancel(e);
    }
  };

  handleOk = (e: React.MouseEvent<HTMLButtonElement>) => {
    const onOk = this.props.onOk;
    if (onOk) {
      onOk(e);
    }
  };
  dragable: Boolean = false;
  lastX: any = 0;
  lastY: any = 0;
  translateX: any = 0;
  translateY: any = 0;
  modalNode: any = null;
  componentDidMount() {
    if (this.props.drag) {
      setTimeout(() => {
        const modalNode: any = document.getElementsByClassName(
          "lean-modal-content"
        )[0];
        this.modalNode = modalNode;
        modalNode.onmousedown = (e: any) => {
          e.preventDefault();
          this.dragable = true;
          this.lastX = e.clientX;
          this.lastY = e.clientY;
          document.addEventListener("mousemove", this.onMove);
        };
        modalNode.onmouseup = (e: any) => {
          this.dragable = false;
          document.removeEventListener("mousemove", this.onMove);
        };
        modalNode.onmouseout = (e: any) => {
          this.dragable = false;
        };
      }, 100);
    }
    if (mousePositionEventBinded) {
      return;
    }
    // 只有点击事件支持从鼠标位置动画展开
    addEventListener(document.documentElement, "click", (e: MouseEvent) => {
      mousePosition = {
        x: e.pageX,
        y: e.pageY
      };
      // 100ms 内发生过点击事件，则从点击位置动画展示
      // 否则直接 zoom 展示
      // 这样可以兼容非点击方式展开
      setTimeout(() => (mousePosition = null), 100);
    });

    mousePositionEventBinded = true;
  }
  onMove = (e: any) => {
    if (this.dragable) {
      const translateX = e.clientX - this.lastX;
      const translateY = e.clientY - this.lastY;
      this.translateX = this.translateX + translateX;
      this.translateY = this.translateY + translateY;
      this.modalNode.style.left = `${this.translateX}px`;
      this.modalNode.style.top = `${this.translateY}px`;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    }
  };
  renderFooter = () => {
    const { okText, okType, cancelText } = this.props;
    return (
      <div>
        <Button onClick={this.handleCancel}>{cancelText || "cancel"}</Button>
        <Button type={okType} onClick={this.handleOk}>
          {okText || "ok"}
        </Button>
      </div>
    );
  };
  render() {
    const { footer, visible, align, className } = this.props;

    return (
      <Dialog
        {...this.props}
        className={classNames(className, align)}
        footer={footer === undefined ? this.renderFooter() : footer}
        visible={visible}
        mousePosition={mousePosition}
        onClose={this.handleCancel}
      />
    );
  }
}
