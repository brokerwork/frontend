import { Component } from "react";
import classNames from "classnames";
import "./index.less";
import { Modal } from "antd";
import imgScale from "@/images/scale.svg";
import imgShrink from "@/images/shrink.svg";

export default class ScaleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isScale: false
    };
  }
  onScale = () => {
    this.setState(
      {
        isScale: !this.state.isScale
      },
      () => {
        const scaleModal = document.getElementsByClassName("scaleModal");
        if (scaleModal && scaleModal.length) {
          const modalContent = scaleModal[0].querySelector(
            ".ant-modal-content"
          );
          if (this.state.isScale) {
            modalContent.classList.add("scale_modal_max");
          } else {
            modalContent.classList.remove("scale_modal_max");
          }
        }
      }
    );
  };
  render() {
    const { children, ...other } = this.props;
    const { isScale } = this.state;
    return (
      <Modal
        {...other}
        wrapClassName="scaleModal"
        title={
          <div className="scale_modal_title">
            <span>{this.props.title}</span>
            <img
              src={isScale ? imgShrink : imgScale}
              className="scale_icon"
              onClick={this.onScale}
            />
          </div>
        }
        ref={el => (this.scaleModalref = el)}
      >
        {children}
      </Modal>
    );
  }
}
