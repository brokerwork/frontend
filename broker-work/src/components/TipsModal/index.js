import { Button } from 'react-bootstrap';
import Modal from 'components/Modal';
import i18n from 'utils/i18n';
import cs from './TipsModal.less';
import { Dialog } from 'lean-ui';

export default class TipsModal extends PureComponent {
  state = {
    show: false
  };
  componentDidMount() {
    this.setState({
      show: true
    });
  }
  close = () => {
    const { onHide } = this.props;
    this.setState({
      show: false
    });
    setTimeout(() => {
      onHide();
    }, 400);
  };
  render() {
    const {
      content,
      trust = false,
      noCancel = false,
      noFooter = false,
      noConfirm = false,
      onConfirm = this.close,
      confirmBtnStyle = 'primary',
      confirmBtnText = i18n['tipsmodal.confirm'],
      onCancel = this.close,
      cancelBtnStyle = 'default',
      cancelBtnText = i18n['tipsmodal.cancel'],
      header = i18n['tipsmodal.title'],
      footer = undefined,
      bsSize = 'small',
      className = '',
      closeButton = true,
      textCenter = true,
      maskClosable = true
    } = this.props;
    const { show } = this.state;
    const htmlObj = { __html: content };
    const sizeMap = {
      small: '420px',
      large: '900px',
      full: window.innerWidth + 'px'
    };
    const size = sizeMap[bsSize] || '600px';
    return (
      <Dialog
        style={{ width: size, top: 0 }}
        title={header}
        visible={show}
        destroyOnClose
        closable={closeButton}
        footer={noFooter ? null : footer}
        okText={noConfirm ? confirmBtnText : confirmBtnText}
        okType={noConfirm ? cancelBtnStyle : confirmBtnStyle}
        cancelText={cancelBtnText}
        maskClosable={maskClosable}
        // mousePosition
        onOk={
          noConfirm
            ? onCancel.bind(this, this.close)
            : onConfirm.bind(this, this.close)
        }
        onCancel={onCancel.bind(this, this.close)}
      >
        <div className={cs.limit}>
          {trust ? <div dangerouslySetInnerHTML={htmlObj} /> : content}
        </div>
      </Dialog>
    );
    // return (
    //   <Modal show={show} bsSize={bsSize} className={`${className}`}>
    //     <Modal.Header>
    //       {closeButton ? (
    //         <button
    //           type="button"
    //           className="close"
    //           onClick={onCancel.bind(this, this.close)}
    //         />
    //       ) : (
    //         undefined
    //       )}
    //       <Modal.Title id="tips-modal">{header}</Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body>
    //       {trust ? <div dangerouslySetInnerHTML={htmlObj} /> : content}
    //     </Modal.Body>
    //     {noFooter ? (
    //       undefined
    //     ) : (
    //       <Modal.Footer>
    //         {footer ? (
    //           footer
    //         ) : (
    //           <div>
    //             {!noConfirm ? (
    //               <Button
    //                 onClick={onConfirm.bind(this, this.close)}
    //                 bsStyle={confirmBtnStyle}
    //               >
    //                 {confirmBtnText}
    //               </Button>
    //             ) : (
    //               undefined
    //             )}

    //             {!noCancel ? (
    //               <Button
    //                 onClick={onCancel.bind(this, this.close)}
    //                 bsStyle={cancelBtnStyle}
    //               >
    //                 {cancelBtnText}
    //               </Button>
    //             ) : (
    //               undefined
    //             )}
    //           </div>
    //         )}
    //       </Modal.Footer>
    //     )}
    //   </Modal>
    // );
  }
}
