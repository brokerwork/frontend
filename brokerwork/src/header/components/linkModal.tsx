require('react-copy-to-clipboard');
// libs
import * as React from 'react';
import { Modal } from 'react-bootstrap';
import { Button, Message } from 'fooui';
import { HttpClient } from '../../http/httpclient';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { I18nLoader } from '../../i18n/loader';
/* ------------------- main start ---------------------- */

interface P {
    myIntroduceLink:any,
    onHide: Function,
}

interface S {
    copy: boolean,
    showSuccessModal: boolean
}

class LinkModal extends React.Component<P, S> {
    constructor(props: P) {
        super(props);
        this.state = {
            copy: false,
            showSuccessModal: false
        }
    }

    copyData = () => {
        this.setState({
            copy: true
        });
        this.showClipSuccess();

    }

    onHide = () => {
        this.props.onHide();
    }

    showClipSuccess = () => {
        this.setState({
            showSuccessModal: true
        })
        setTimeout(() => {
           this.hideClipSuccess();
        }, 400);
    }

    hideClipSuccess = () => {
        this.setState({
            showSuccessModal: false
        })
    }

    render() {
        const {onHide, myIntroduceLink} = this.props;
        const { showSuccessModal} = this.state;
        return (
            <Modal onHide={onHide} show={true} className="linkModal">
                <Modal.Header>
                    <Modal.Title>{I18nLoader.get('introduce.link_modal_title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="referralLink-div">
                        {myIntroduceLink.map((item: any, index) => {
                            return (
                                <div key={index} className={'referralLink-div'}>
                                    <label className={"col-sm-4 control-label label"}>{item.name} : </label>
                                    <div className={'col-sm-6 link-text'}><a href={item.http + item.url} target='_blank'>{item.http + item.url}</a></div>
                                    <CopyToClipboard 
                                        text={item.http + item.url}
                                        onCopy={this.copyData}>
                                        <Button bsStyle="primary" className={'clipbtn'}>{I18nLoader.get('general.clip')}</Button>
                                    </CopyToClipboard>
                                </div>)
                        })}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={this.onHide}>{I18nLoader.get('introduce.link_modal_confirm')}</Button>
                </Modal.Footer>
                {
                    showSuccessModal
                    ? <div className='alert-tips'>{I18nLoader.get('general.clip_success')}</div>
                    : undefined
                }
                
            </Modal>
        )
    }
}


export default LinkModal;
