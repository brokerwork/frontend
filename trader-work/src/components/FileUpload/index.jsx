import { Component } from "react";
import uuid from "uuid";
import { Upload, Icon, Modal, Spin } from "antd";
import "./index.less";
import classNames from "classnames";
import i18n from "@/utils/i18n";
import { ls, BRAND_INFO } from "@/utils/storage";
import utils from "@/utils/common";
import ReactDom from 'react-dom'
import message from '@/components/Message'

export default class FileUpload extends Component {
  static defaultProps = {
    invalidImageFormatErrorMsg: i18n["general.upload.imageFormatError"], //'仅支持jpg，png',
    invalidImageSizeErrorMsg: i18n["general.upload.imageSizeError"], //'图片不能超过5M',
    required: false,
    numMax: 3, //1表示只能上传单张图片,返回value格式为string，其余为array
    listType: "picture-card", //图片列表展现样式模板text, picture 和 picture-card,参考antd
    onUploadSuccess: null,
    onUploadFailed: null,
    disabled: false,
    accept: "image/gif,image/jpeg,image/jpg,image/png,image/svg,.pdf"
  };
  type = 'image'
  constructor(props) {
    super(props);
    const brandInfo = ls.getItem(BRAND_INFO);
    this.state = {
      tenantId: brandInfo.tenantId,
      env: brandInfo.env,
      previewVisible: false, //预览弹窗开关
      previewImage: "", //当前预览图片
      progressPercentage: 0, //上传进度
      value: this.valueFormatter(this.props.value), //fileList,为了配合FormItem使用，名称固定为value
      compressing: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if ("value" in nextProps) {
      const value = this.valueFormatter(nextProps.value);
      this.setState({ value });
    }
  }
  valueFormatter = value => {
    if (typeof value === "string" && value != "") {
      value = [
        {
          uid: -1,
          status: "done",
          url: utils.isFullUrl(value) ? value : `/api${value}`,
          realurl: value
        }
      ];
    } else if (!value) {
      value = [];
    }
    return value;
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.isPdf = /\.pdf$/.test(file.url)
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };
  //自定义了onRemove和beforeUpload方法，该方法已经不用了
  handleChange = ({ fileList }) => {
    return false;
    if (!("value" in this.props)) {
      this.setState({ value: fileList });
    }
    const onChange = this.props.onChange;
    if (onChange) {
      if (this.props.numMax == 1) {
        if (fileList.length > 0) {
          //如果是单个上传，则传递图片地址字符串，多个为数组
          fileList = fileList.slice(-1).realurl;
        } else {
          fileList = "";
        }
      }
      onChange(fileList);
    }
  };
  onRemove = file => {
    const matchKey = file.uid !== undefined ? "uid" : "name";
    let value = this.state.value.filter(
      item => item[matchKey] !== file[matchKey]
    );
    if (!("value" in this.props)) {
      this.setState({ value });
    }
    const onChange = this.props.onChange;
    if (onChange) {
      if (this.props.numMax == 1) {
        if (value.length > 0) {
          //如果是单个上传，则传递图片地址字符串，多个为数组
          value = value.slice(-1).realurl;
        } else {
          value = "";
        }
      }
      onChange(value);
    }
  };
  compressFile = (file)=>{
    return new Promise((resolve,reject)=>{
      if(file.type.indexOf('pdf')!==-1){
        resolve(file)
      }
      // 压缩文件需要的对象
      let reader = new FileReader()
      let img = new Image()
      reader.readAsDataURL(file)
      reader.onload = function(e){
        img.src = e.target.result
      }
      img.onload = function(){
        let canvas = document.createElement('canvas')
        let context = canvas.getContext('2d')
        // 图片原始尺寸
        let originWidth = this.width
        let originHeight = this.height
        // 目标尺寸 
        let targetWidth = 800
        let targetHeight = originHeight * targetWidth /originWidth
        // canvas对图片进行缩放
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // 清除画布
        context.clearRect(0, 0, targetWidth, targetHeight);
        // 图片压缩
        context.drawImage(img,0,0,targetWidth,targetHeight)
        // 压缩后转base64 url
        // let newUrl = canvas.toDataURL('image/jpeg',0.92)
        //兼容IE
        if (!HTMLCanvasElement.prototype.toBlob) {
          Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
           value: function (callback, type, quality) {
         
             var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
                 len = binStr.length,
                 arr = new Uint8Array(len);
         
             for (var i=0; i<len; i++ ) {
              arr[i] = binStr.charCodeAt(i);
             }
         
             callback( new Blob( [arr], {type: type || 'image/png'} ) );
           }
          });
         }
        // 压缩后转blob
        canvas.toBlob((blob)=>{
          resolve(blob)
        },'image/jpeg',0.92)
      }
    })
  }
  beforeUpload = file => {
    // if (/[~`!@#$%^&*—+]/gi.test(file.name)||file.name.split('.').length>2) {
    //   message.warning(i18n['upload.support.char.tip'])
    //   return false;
    // }
    let suffix = file.name.split('.').pop().toLowerCase();
    if (this.props.accept.indexOf(suffix)===-1) {
      message.warning(i18n['upload.support.tip'])
      return false;
    }
    let name = file.name.split('.')[0];
    const { env, tenantId } = this.state;
    const filename = `${uuid.v1()}.${suffix}`;
    this.filename = file.name;
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    // 压缩图片
    this.setState({
      compressing: true
    })
    this.compressFile(file).then(blob=>{
      formData.append("file", blob);
      formData.append("name", filename);
      formData.append("tenantId", tenantId);
      let host = "";
      switch (env) {
        case "prod":
          host = "https://prod-uploadpic.lwork.com";
          break;
        case "qa":
          host = "https://qa-uploadpic.lwork.com";
          break;
        default:
          host = "//dev.uploadpic.lwork.com";
          break;
      }
      const uploadUrl = `${host}/v1/aliyun/oss/tw/upload`;
      xhr.open("POST", uploadUrl, true);
      // 进度
      xhr.upload.onprogress = e => {
        const percentage = (e.loaded / e.total) * 100;
          this.setState({
            progressPercentage: percentage.toFixed(0)
          });
      };
      // 上传结果
      xhr.onload = () => {
        this.setState({
          compressing: false
        })
        if (xhr.status === 200) {
          const resData = JSON.parse(xhr.responseText);
          let url = resData.data;
          file.realurl = url;
          file.url = utils.isFullUrl(url) ? url : `/api${url}`;
          let value = [];
          if (this.props.numMax == 1) {
            value = [file];
          } else {
            value = [...this.state.value, file];
          }
          if (!("value" in this.props)) {
            this.setState({ value });
          }
          //强制处理pdf
          this.handlePdf(this.filename)
          
          const onChange = this.props.onChange;
          if (onChange) {
            if (this.props.numMax == 1) {
              onChange(file.realurl);
            } else {
              onChange(value);
            }
          }
          if (this.props.onUploadSuccess)
            this.props.onUploadSuccess(signature.preview);
        } else {
          if (this.props.onUploadFailed)
            this.props.onUploadFailed(new Error("Failed to upload file."));
        }
      };
      // 上传
      xhr.send(formData);
    })
    return false; //返回false后还是会执行onChange，只是中断了默认的上传行为
  };
  getUrls = () => {
    return this.state.value.map(e => e.realurl);
  };
  isValid = () => {
    let r = true;
    if (this.props.required) {
      r = this.state.value.length > 0;
    }
    if (!r) {
      this.showErrorMsg(this.props.requiredErrorMsg);
    }
    return r;
  };
  handlePdf = (filename) => {
    setTimeout(() => {
      let dom = ReactDom.findDOMNode(this.refs.upload).querySelector('.ant-upload-list-item-icon')
      if(!dom) return
      dom.outerHTML = filename
    },0)
  }
  componentDidMount() {
    if (this.state.value[0]) {
      let nameArr = this.state.value[0].url.split('_')[0].split('/')
      this.handlePdf(`${nameArr[nameArr.length-1]}.pdf`)
    }
  }
  render() {
    const { className, listType, disabled, accept } = this.props;
    const { previewVisible, previewImage, value, progressPercentage, compressing } = this.state;
    const classes = classNames({
      ["tw-fileupload"]: true,
      [className]: className
    });
    const uploadButton = (
      <div>
        
        {compressing ? <div>
            {/* 上传中...{progressPercentage} */}
            <Spin />
          </div>: [
            <Icon type="plus" />,
            <div className="ant-upload-text">{i18n["upload.tip"]}</div>
          ]}
      </div>
    );
    return (
      <div className={classes}>
        <Upload
          ref="upload"
          accept={accept}
          listType={listType}
          fileList={value}
          disabled={disabled}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          beforeUpload={this.beforeUpload}
          onRemove={this.onRemove}
          multiple={this.props.numMax > 1}
          showUploadList={{ showRemoveIcon: !disabled }}
        >
          {value.length >= this.props.numMax ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
          width={800}
        >
          {!this.isPdf && <img alt="example" style={{ width: "100%" }} src={previewImage} />}
          {this.isPdf && <iframe src={previewImage} style={{width: '100%', height: '500px', border: '0'}}></iframe>}
        </Modal>
      </div>
    );
  }
}
