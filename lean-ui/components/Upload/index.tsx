import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import Icon from "../Icon";
import RcUpload from "rc-upload";
import Button from "../Button";
const prefix = "lean";
import Dialog from "../Dialog";

export interface UploadProps {
  type?: string;
  maxLength?: number;
  maxWidth?: number;
  maxHeight?: number;
  maxSize?: number;
  action?: string;
  data?: object;
  className?: string;
  disabled?: boolean;
  accept?: string;
  withCredentials?: boolean;
  multiple?: boolean;
  onStart?: Function;
  onError?: Function;
  onSuccess?: Function;
  onProgress?: Function;
  onChange?: Function;
  onRemove?: Function;
  onFocus?: Function;
  notify?: Function;
  srcList?: Array<string>;
  value?: string;
  dragText?: string;
  isHead?: boolean;
  drag?: boolean;
}

class Upload extends React.Component<UploadProps, any> {
  static defaultProps = {
    type: "button",
    maxLength: 1,
    maxWidth: 10000,
    maxHeight: 10000,
    maxSize: 100000,
    action: "",
    data: {},
    className: "",
    disabled: false,
    withCredentials: false,
    multiple: false,
    onStart: () => {},
    onChange: () => {},
    onError: (err: any, response: any, file: any) => {},
    onSuccess: (result: any, file: any, xhr: any) => {},
    onProgress: () => {},
    notify: () => {},
    accept: "image/*",
    dragText: "将文件拖到此处，或点击上传",
    isHead: false,
    drag: true
  };
  static propTypes = {
    type: PropTypes.oneOf(["button", "drag"]),
    maxLength: PropTypes.number,
    maxSize: PropTypes.number,
    /** 目标url */
    action: PropTypes.string,
    children: PropTypes.string,
    /** 其他数据 */
    data: PropTypes.object,
    className: PropTypes.string,
    /** 禁用 */
    disabled: PropTypes.bool,
    /** 是否支持多文件上传 only support ie10+*/
    multiple: PropTypes.bool,
    /** ajax上传是否携带cookie*/
    withCredentials: PropTypes.bool,
    /** 开始上传回调 */
    onStart: PropTypes.func,
    onChange: PropTypes.func,
    /** 上传失败回调 */
    onError: PropTypes.func,
    /** 上传成功回调 */
    onSuccess: PropTypes.func,
    /** 上传进度回调，只支持现代浏览器 */
    onProgress: PropTypes.func,
    accept: PropTypes.string,
    notify: PropTypes.func,
    /** 是否是上传头像 */
    isHead: PropTypes.bool
  };
  state: any = {
    isEnter: false,
    imgs: this.props.srcList,
    visible: false,
    currentImg: ""
  };
  componentWillReceiveProps(nextprops: any) {
    // 替换缩略图路径以实现预览功能
    if (nextprops.srcList && !!nextprops.srcList.length) {
      let imgs = [...this.state.imgs];
      nextprops.srcList.forEach((el: any, index: any) => {
        let name = "";
        if (imgs[index]) {
          name = imgs[index].name;
        }
        let replceImg = {
          src: el.src,
          name: name,
          progress: el.progress
        };
        imgs.splice(index, 1, replceImg);
        this.setState({
          imgs
        });
      });
    }
  }
  setThumb = (path: any, file: { name: any }) => {
    let imgs = this.state.imgs;
    let progress = 0;
    if (this.props.isHead) {
      this.setState({
        imgs: [
          {
            src: path,
            name: file.name,
            progress
          }
        ]
      });
      return;
    }
    let timer = setInterval(() => {
      progress = progress + 10;
      this.setState({
        imgs: [
          {
            src: path,
            name: file.name,
            progress
          },
          ...imgs
        ]
      });
      if (progress == 100) {
        progress = 0;
        clearInterval(timer);
      }
    }, 100);
  };
  beforeUpload = (file: any, fileList: any) => {
    if (this.props.type == "drag") {
      return true;
    }
    this.props.onChange({
      file,
      fileList
    });
    if (file.size > this.props.maxSize * 1024 * 1024) return;
    if (/[~`!@#$%^&*—+]/gi.test(file.name)) {
      return;
    }
    let isPdf = /pdf/.test(file.type);
    if (!isPdf) {
      let reader = new FileReader();
      let path = "";
      let imgs = this.state.imgs;
      reader.readAsDataURL(file);
      reader.onload = e => {
        path = e.target.result;
        // width height
        let img = new Image();
        img.src = path;
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > this.props.maxWidth || height > this.props.maxHeight) {
            return;
          }
          this.setThumb(path, file);
        };
      };
    } else {
      this.setThumb(".pdf", file);
    }
    return false;
  };
  isPdf: boolean;
  startUpload = (file: any) => {
    if (this.props.type == "drag") {
      this.props.onStart(file);
    }
  };

  uploadError = (result: any, file: any, xhr: any) => {
    this.props.onError(result, file, xhr);
    // console.log(result,file,xhr)
  };
  preview = (src: string) => {
    this.isPdf = /\.pdf$/.test(src);
    this.setState({
      visible: true,
      currentImg: src
    });
  };
  cancelPreview = () => {
    this.setState({
      visible: false
    });
  };
  remove = (index: any) => {
    const { onRemove, multiple, onFocus } = this.props;
    const { imgs } = this.state;
    let newSrcList = imgs.concat();
    newSrcList.splice(index, 1);
    this.setState({
      imgs: newSrcList
    });
    if (onFocus) {
      onFocus(); //配合客户详情交互
    }
    if (onRemove) {
      if (multiple) {
        onRemove(newSrcList);
      } else {
        onRemove("");
      }
    }
  };
  _renderProgress = (progress: number) => {
    return (
      <div className="progress-container">
        <div className="progress" style={{ width: `${progress}%` }} />
      </div>
    );
  };
  _renderResultTypeClick = () => {
    return this.state.imgs.map((img: any, index: number) => {
      let originName = img.src.split("/").pop();
      let suffix = img.src.split("_").pop();
      let showName = originName.replace(
        `_${suffix}`,
        `.${suffix.split(".").pop()}`
      );
      let isPdf = /\.pdf$/.test(img.src) || /\.pdf$/.test(img.name);
      return (
        <div key={index} className={`${prefix}-upload-container`}>
          <Icon
            icon="close"
            className="icon"
            onClick={this.remove.bind(this, index)}
          />
          {!isPdf && (
            <img
              src={img.src}
              alt=""
              onClick={this.preview.bind(this, img.src)}
            />
          )}
          {!isPdf && <span>{img.name || showName}</span>}
          {isPdf && (
            <span onClick={this.preview.bind(this, img.src)}>
              {img.name || showName}
            </span>
          )}
          {!isPdf && <p>{img.progress} %</p>}
          {this._renderProgress(img.progress)}
        </div>
      );
    });
  };
  _renderResultTypeDrag = () => {
    return this.state.imgs.map((img: any, index: number) => {
      return (
        <div key={index} className={`${prefix}-upload-container-drag`}>
          <Icon
            icon="close"
            className="icon"
            onClick={this.remove.bind(index)}
          />
          <img src={img.src} alt="" />
          <span>{img.name}</span>
          {this._renderProgress(img.progress)}
        </div>
      );
    });
  };
  componentDidMount() {
    let dropArea = document.getElementById("dropArea");
    if (!dropArea) return;
    dropArea.ondragover = event => {
      event.preventDefault();
      this.setState({
        isEnter: true
      });
    };
    dropArea.ondragleave = event => {
      this.setState({
        isEnter: false
      });
    };
  }
  render() {
    const {
      children,
      disabled,
      type,
      action,
      data,
      multiple,
      onStart,
      onError,
      onSuccess,
      onChange,
      onProgress,
      withCredentials,
      className,
      accept,
      maxLength,
      isHead,
      drag
    } = this.props;
    const cl = classNames(`${prefix}-upload`, className);
    const dragAreaCl = classNames("upload-drag", {
      enter: this.state.isEnter
    });
    return (
      <div>
        {type === "button" && (
          <div className={`${cl} ${isHead && "is-head"}`}>
            <RcUpload
              accept={accept}
              action={action}
              data={data}
              multiple={multiple}
              disabled={
                disabled || (maxLength == this.state.imgs.length && !isHead)
              }
              withCredentials={withCredentials}
              beforeUpload={this.beforeUpload}
              onStart={this.startUpload}
              onError={this.uploadError}
              onSuccess={onSuccess}
              onProgress={onProgress}
            >
              <Button
                disabled={
                  disabled || (maxLength == this.state.imgs.length && !isHead)
                }
                type="default"
                className="upload-button"
              >
                {children}
                <Icon icon="upload" />
              </Button>
            </RcUpload>
            {!!this.state.imgs.length && this._renderResultTypeClick()}
          </div>
        )}
        {type === "drag" && (
          <div className={cl} id="dropArea">
            <RcUpload
              accept={accept}
              action={action}
              data={data}
              multiple={multiple}
              disabled={disabled}
              withCredentials={withCredentials}
              beforeUpload={this.beforeUpload}
              onStart={this.startUpload}
              onError={this.uploadError}
              onSuccess={onSuccess}
              onProgress={onProgress}
            >
              <div className={dragAreaCl}>
                <Icon icon="upload" className="icon" />
                {this.props.dragText}
              </div>
            </RcUpload>
            {/* {!!this.state.imgs.length&&this._renderResultTypeDrag()} */}
          </div>
        )}
        {this.state.visible && (
          <Dialog
            width={800}
            visible={this.state.visible}
            onCancel={this.cancelPreview}
            drag={drag}
            footer={<div />}
          >
            {!this.isPdf && (
              <img
                style={{ width: "100%", marginTop: 24 }}
                src={this.state.currentImg}
                alt=""
              />
            )}
            {this.isPdf && (
              <iframe
                src={this.state.currentImg}
                style={{ width: "100%", height: "500px", border: "0" }}
              />
            )}
          </Dialog>
        )}
        {/* // 预览 */}
      </div>
    );
  }
}

export default Upload;
