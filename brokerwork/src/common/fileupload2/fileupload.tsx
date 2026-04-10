// libs
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';
import {Modal, Message} from 'fooui';
// components
// import {Message} from '../message';
require('es6-promise').polyfill();
var uuid = require('uuid');

/*
* @title:默认是“上传文件”，可以进行修改
* @className: 用来修改样式
 */
interface P{
    keepOriginalName?:boolean;
    showImagePreview?:boolean;
    title?: string;
    hasIcon?: boolean;
    onUploadComplete?:Function; //上传成功后的回调
    uploadFileExtensions?:Array<string>;
    className?: string;
    style?: string;
    uploadSizeLimit?:number; //byte
    token?:string
}
interface S{
    showUploadZone?: boolean;
    progressbarPctWidth?: string; //50%
    uploadSize?: number;
    uploadTotal?: number;
    allowUpload?: boolean;
}

class FileUpload extends React.Component<P,S>{
    refs: any;
    fileSrc: string;
    fileSize: number;
    fileName: string;
    file: any;
    constructor(props: P) {
        super(props);
        this.fileSrc = null;
        this.fileSize = null;
        this.fileName = '';
        this.file = null;
        this.state = {
            showUploadZone: false,
            progressbarPctWidth: '0',
            uploadSize: 0,
            uploadTotal: 0,
            allowUpload: true
        };
    }
    static defaultProps = {
        title: '上传文件',
        className: 'ghost-btn',
        hasIcon: true,
        style: 'block',
        onUploadComplete: function(uploader){},
        uploadFileExtensions:['jpg','png'],
        showImagePreview: true,
        uploadSizeLimit: 5 * 1024 * 1024 //5MB
    };

    reset = ()=>{
        this.setState({
            showUploadZone: false
        })
    }

    getRandomFileName(originName){
        var randomstr = uuid.v1();
        var newFileName = originName.replace(/.*(\.\w+)$/, (m,m1)=>{return randomstr+m1});
        return newFileName;
    }

    // 上传BUTTON
    _startUpload = ()=> {
        if (!this.state.allowUpload){
            var sizeMB = this.props.uploadSizeLimit / 1024 / 1024 + ' MB';
            Message.error('上传文件大小不得大于 ' + sizeMB);
            return;
        }
        let self = this;
        this._initOssSignature()
            .then(signature=>{
                let newFileName = this.props.keepOriginalName ? this.fileName : this.getRandomFileName(this.fileName);
                self.fileName = newFileName;
                const fileSrc = signature.host + "/" + signature.dir + "/" +newFileName;
                let xhr = new XMLHttpRequest();
                xhr.open('POST', signature.host, true);
                let formData = new FormData();
                formData.append('OSSAccessKeyId', signature.accessId);
                formData.append('policy', signature.policy);
                formData.append('Signature', signature.signature);
                formData.append('success_action_status', '200');

                formData.append('key', signature.dir+'/'+newFileName);
                formData.append('file', self.file);

                xhr.upload.onprogress = function(event: any) {
                    let pct = (event.loaded / event.total) * 100 + '%';
                    self.setState({
                        uploadSize: event.loaded,
                        uploadTotal: event.total,
                        progressbarPctWidth: pct
                    });
                };
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        self.props.onUploadComplete(self, fileSrc);
                        Message.success('上传成功!');
                    }else {
                        self.setState({
                            uploadSize: 0,
                            uploadTotal: 0,
                            progressbarPctWidth: 0
                        });
                        Message.error('上传失败!');
                    }
                };
                xhr.send(formData);
            })
            .catch(err=>{
                alert(err);
            })
    }
    // Get image infomattions
    _onChange = (event: any)=>{

        this.setState({
            uploadSize: 0,
            uploadTotal: 0,
            progressbarPctWidth: 0,
            showUploadZone: false
        });
        this.file = event.currentTarget.files[0];
        this.fileName = this.file.name;
        this.fileSize = this.file.size;

        if (this.props.uploadSizeLimit != null){
            this.setState({allowUpload: this.fileSize < this.props.uploadSizeLimit});
        }

        let readFile: any = new FileReader();
        let self = this;
        if (typeof FileReader === 'undefined') {
            Message.error('您的浏览器不支持FileReader');
            return false;
        }
        var isValidFileType = false;
        var fileName = this.fileName;
        var acceptableUploadFileTypes = this.props.uploadFileExtensions;
        acceptableUploadFileTypes.forEach(extention=>{
            var regex = new RegExp(`.${extention}$`, 'i');
            if (regex.test(fileName)){
                isValidFileType = true;
            }
        })
        if (!isValidFileType){
            Message.error(`请确保上传文件是属于这些类型:${acceptableUploadFileTypes.join(', ')}`);
            return false;
        }

        readFile.readAsDataURL(this.file);
        readFile.onload = function() {
            self.fileSrc = this.result;
            self.setState({
                showUploadZone: true,
                uploadSize: 0,
                progressbarPctWidth: 0
            });
        }
        readFile.onabort = function () {
            Message.error('选取文件失败,文件读取中断!');
        }
        readFile.onerror = function () {
            Message.error('选取文件失败，文件读取出错!');
        }
    };
    _onShowBigImg = ()=> {
        window.open(this.fileSrc);
    }
    // 渲染上传显示区域
    renderUploadZone = ()=> {
        let self = this;
        let refContentCreator = function(){
            return (
                <div>
                {
                    self.props.showImagePreview ? <img src={self.fileSrc} width="100px" height="100px" onClick={self._onShowBigImg}/> :
                        null
                }

                <div>{self.fileName}</div>
            </div>
            )
        };
        let m:any = Modal.show({
            title: '上传图片',
            hasOk: true,
            hasCancel: true,
            okText: '确定上传',
            cancelText: '取消',
            className:'uploadmodal',
            onOk: (m:any)=>{ 
                self._startUpload();
                self.reset();
                m.close();
            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        })
    }

    _initOssSignature = ()=> {
        const {token} = this.props;
        var promise = new Promise(function(resolve, reject){
            let xhr = new XMLHttpRequest();
            xhr.open('GET', '/v1/aliyun/signature', true);
            xhr.setRequestHeader('X-Api-Token', token);
            xhr.setRequestHeader('X-Request-With', 'XMLHttpRequest');
            xhr.onload = function() {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText).data);
                }
                else {
                    reject('init oss signature fail')
                }
            }
            xhr.send();
        });
        return promise;
    }

    render() {
        var uploadStyle = {
            position: 'absolute',
            opacity: 0,
            zIndex: 100,
        };
        let newStyle = 'ghost-btn ' + this.props.className;
        let iconStyle = '';
        if (this.props.hasIcon) {
            iconStyle = "fa fa-paperclip";
        }
        return (
            <div className="uploadcontent" style={{display: this.props.style}}>
                <Button className={newStyle} style={{overflow:"hidden", position:"relative"}}>
                    <input ref="fileupload" 
                            type="file" 
                            name="fileupload" 
                            style={uploadStyle} 
                            onChange={this._onChange} 
                     />
                    <span className={iconStyle}> {this.props.title}</span>
                </Button>
                {this.state.showUploadZone ?  this.renderUploadZone(): null}
            </div>
        );
    }
}

export {FileUpload};