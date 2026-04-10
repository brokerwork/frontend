import Modal from 'components/Modal';
import i18n from 'utils/i18n';

export default class TipsModal extends PureComponent {
  close = () => {
    const { onHide } = this.props;

    onHide();
  }

  render() {
    const {
      content,
      trust = false,
      noCancel = false,
      noConfirm = false,
      onConfirm = this.close,
      confirmBtnStyle = 'primary',
      confirmBtnText = i18n['tipsmodal.confirm'],
      onCancel = this.close,
      cancelBtnStyle = 'default',
      cancelBtnText = i18n['tipsmodal.cancel'],
      header = i18n['tipsmodal.title'],
      footer = null,
      size = 'sm',
      className = '',
    } = this.props;
    const htmlObj = {__html: content};
    return (
      <Modal
        onClose={this.close}
        size={size}
        className={className}
      >
        <Modal.Header>
          {header}
        </Modal.Header>
        <Modal.Body>
          {trust
            ? <div dangerouslySetInnerHTML={htmlObj} />
            : content
          }
        </Modal.Body>
        <Modal.Footer>
          {footer
            ? footer
            : <div>
              {!noConfirm
                ? <button 
                    type="button"
                    className={`btn btn-${confirmBtnStyle}`}
                    onClick={onConfirm.bind(this, this.close)}
                  >
                    {confirmBtnText}
                  </button>
                : undefined}

              {!noCancel
                ? <button type="button"
                    className={`btn btn-${cancelBtnStyle}`}
                    onClick={onCancel.bind(this, this.close)}
                  >
                    {cancelBtnText}
                  </button>
                : undefined}
            </div>}
        </Modal.Footer>
      </Modal>
    );
  }
}
