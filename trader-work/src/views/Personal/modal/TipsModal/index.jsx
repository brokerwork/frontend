import React, { PureComponent } from "react";
import "./index.less";
import i18n from "@/utils/i18n";
import { Modal, Button } from "antd";

export class TipsModal extends PureComponent {
  renderItem = (text, index) => {
    return (
      <div className="modal-content" key={index}>
        {text}
      </div>
    );
  };
  onCancel = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
  };

  onSubmit = () => {
    const { onSubmit } = this.props;
    onSubmit && onSubmit();
  };

  render() {
    const { data = [], ...props } = this.props;
    return (
      <Modal
        {...props}
        footer={
          <span>
            <Button onClick={this.onSubmit} type="primary">
              {i18n["general.button.sure"]}
            </Button>
            <Button onClick={this.onCancel}>
              {i18n["general.button.cancel"]}
            </Button>
          </span>
        }
      >
        <div className="modal-wrapper">{data.map(this.renderItem)}</div>
      </Modal>
    );
  }
}

export default TipsModal;
