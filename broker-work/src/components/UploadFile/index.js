import { post, get } from 'utils/ajax';
import { showTipsModal, showTopAlert } from 'commonActions/actions';
import { connect } from 'react-redux';
import uuid from 'uuid';
import { FormattedMessage } from 'react-intl';
import { getBrandInfo } from 'utils/brandInfo';
import cs from './UploadFile.less';
import i18n from 'utils/i18n';
import {
  fileExtensions,
  imageExtensions,
  uploadSizeLimit,
  uploadMaxAmount
} from 'utils/config';
import defaultImage from '../../commonActions/default.png';

const randomName = fileName => {
  const randomstr = uuid.v1();
  const newFileName = fileName.replace(/(.*)(\.\w+)$/, (m, name, ext) => {
    // return `${randomstr}${ext}`;
    return `${name.substr(0, 128)}_${randomstr}${ext}`;
  });
  return newFileName;
};

class UploadFile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      keepOriginalName: props.keepOriginalName,
      fileExtensions: props.fileExtensions || fileExtensions,
      uploadSizeLimit: props.uploadSizeLimit || uploadSizeLimit,
      //用undefined判断 false表示不限制
      uploadMaxAmount:
        typeof props.uploadMaxAmount === 'undefined'
          ? uploadMaxAmount
          : props.uploadMaxAmount,
      srcList: this.props.value
        ? Array.isArray(this.props.value)
          ? this.props.value
          : [this.props.value]
        : []
    };
  }

  onChange = evt => {
    const { onChange } = this.props;
    const file = evt.target.files[0];

    evt.target.value = '';
    this.readFile(file);
  };

  remove = index => {
    const { onChange, multiple } = this.props;
    const { srcList } = this.state;
    let newSrcList = srcList.concat();
    newSrcList.splice(index, 1);
    this.setState({
      srcList: newSrcList
    });
    if (onChange) {
      if (multiple) {
        onChange(newSrcList);
      } else {
        onChange('');
      }
    }
  };
  // 同步props传入的value
  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    this.state.srcList = value ? (Array.isArray(value) ? value : [value]) : [];
  }

  handleUploadSuccess = fileSrc => {
    const { onChange, multiple } = this.props;
    const { srcList } = this.state;
    if (onChange) {
      if (multiple) {
        const newSrcList = srcList.concat(fileSrc);
        this.setState({
          srcList: newSrcList
        });
        onChange(newSrcList);
      } else {
        const newSrcList = [fileSrc];
        this.setState({
          srcList: newSrcList
        });
        onChange(fileSrc);
      }
    }
  };

  initOssSignature = () => {
    const info = getBrandInfo();
    return Promise.resolve({ result: true, data: info });
  };

  readFile = file => {
    const { showTopAlert, onlyImage, maxWidth, maxHeight } = this.props;
    const { fileExtensions, uploadMaxAmount, srcList } = this.state;
    if (srcList && uploadMaxAmount && srcList.length >= uploadMaxAmount) {
      showTopAlert({
        content: (
          <FormattedMessage
            id="upload.max_amount"
            defaultMessage={i18n['upload.max_amount']}
            values={{ amount: uploadMaxAmount }}
          />
        )
      });
      return false;
    }
    if (typeof FileReader === 'undefined') {
      showTopAlert({
        content: i18n['upload.brower_support']
      });
      return false;
    }

    const validFileExtensions = onlyImage ? imageExtensions : fileExtensions;
    const fileReader = new FileReader();
    const fileName = file.name;
    const that = this;
    const isValidFileType = validFileExtensions.some(extension => {
      const regex = new RegExp(`.${extension}$`, 'i');
      return regex.test(fileName);
    });

    if (!isValidFileType) {
      showTopAlert({
        content: (
          <FormattedMessage
            id="upload.error.type_list"
            defaultMessage={i18n['upload.error.type_list']}
            values={{
              type_list: validFileExtensions.join('，')
            }}
          />
        )
      });

      return false;
    }
    if (
      imageExtensions.some(extension => {
        const regex = new RegExp(`.${extension}$`, 'i');
        return regex.test(fileName);
      })
    ) {
      fileReader.readAsDataURL(file);
      fileReader.onload = function() {
        const fileSrc = this.result;
        let image = new Image();
        image.src = fileSrc;
        image.onload = function() {
          let width = image.width;
          let height = image.height;
          const allow =
            maxHeight && maxWidth
              ? width === maxWidth && height === maxHeight
              : true;
          if (allow) {
            // that.showUploadModal(file, fileSrc);
            that.upload(file);
          } else {
            showTopAlert({
              content: i18n['upload_file.size_error']
            });
          }
        };
        image.onerror = () => {
          showTopAlert({
            content: i18n['upload.error.read_error']
          });
        };
      };
      fileReader.onabort = function() {
        showTopAlert({
          content: i18n['upload.error.abort']
        });
      };
      fileReader.onerror = function() {
        showTopAlert({
          content: i18n['upload.error.read_error']
        });
      };
    } else {
      this.upload(file);
    }
  };

  showUploadModal = (file, fileSrc) => {
    const { showTipsModal } = this.props;
    const fileName = file.name;
    const content = () => {
      return (
        <div className={cs['image-preview']}>
          <a href={fileSrc} target="_blank">
            <img src={fileSrc} width="100" height="100" />
          </a>
          <div>{fileName}</div>
        </div>
      );
    };

    showTipsModal({
      header: i18n['upload.upload'],
      content: content(),
      confirmBtnText: i18n['upload.upload_confirm'],
      onConfirm: cb => {
        this.upload(file, cb);
      }
    });
  };

  upload = (file, cb) => {
    const { showTopAlert, initOssSignature } = this.props;
    const fileSize = file.size;
    const { uploadSizeLimit } = this.state;
    const action = initOssSignature ? initOssSignature : this.initOssSignature;
    if (fileSize > uploadSizeLimit) {
      const size = uploadSizeLimit / 1024 / 1024;
      // let size = `${Math.floor(uploadSizeLimit / 1024 / 1024 * 100) / 100}MB`;

      showTopAlert({
        content: (
          <FormattedMessage
            id="upload.upload_size"
            defaultMessage={i18n['upload.upload_size']}
            values={{
              size:
                size >= 1
                  ? `${Math.floor(size * 100) / 100}MB`
                  : `${size * 1024}KB`
            }}
          />
        )
      });

      return false;
    }

    action().then(res => {
      if (res.result) {
        this.doUpload(file, res.data, cb);
      } else {
        showTopAlert({
          content: i18n['upload.upload_fail']
        });
      }
    });
  };

  doUpload = (file, signature, cb) => {
    const { showTopAlert, addHttp } = this.props;
    const { keepOriginalName } = this.state;
    const { tenantId, env } = getBrandInfo() || {};
    const fileName = file.name;
    let host = '';
    switch (env) {
      case 'prod':
        host = 'https://prod-uploadpic.lwork.com';
        break;
      case 'qa':
        host = 'https://qa-uploadpic.lwork.com';
        break;
      default:
        host = '//dev.uploadpic.lwork.com';
        break;
    }

    const uploadUrl = `${host}/v1/aliyun/oss/bw/upload`;
    const xhr = new XMLHttpRequest();
    let formData = new FormData();
    const newFileName = keepOriginalName ? fileName : randomName(fileName);
    formData.append('name', newFileName);
    formData.append('tenantId', tenantId);
    formData.append('file', file);

    xhr.open('POST', uploadUrl, true);
    xhr.onload = () => {
      if (xhr.status === 200) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['upload.upload_success']
        });
        if (cb) {
          cb();
        }
        const resData = JSON.parse(xhr.responseText);
        let fileSrc = resData.data;
        if (!/^\/\//gi.test(fileSrc)) {
          fileSrc = `//${fileSrc}`;
        }
        if (addHttp) {
          const protocolStr = document.location.protocol;
          fileSrc = `${protocolStr}${fileSrc}`;
        }
        this.handleUploadSuccess(fileSrc);
      } else {
        showTopAlert({
          content: i18n['upload.upload_fail']
        });
      }
    };
    xhr.send(formData);
  };

  imageOnload = e => {
    const item = e.currentTarget;
    if (item.width > item.height) {
      item.style.height = '100%';
    } else {
      item.style.width = '100%';
    }
    item.style.display = 'inline-block';
  };

  render() {
    const {
      disabled,
      linkDisabled = false,
      error,
      className = '',
      itemClassName = '',
      removabled = true,
      showDefaultImage,
      maxHeight,
      maxWidth,
      multiple
    } = this.props;
    const { srcList } = this.state;

    return (
      <div>
        <label
          className={`${cs['control']} ${
            disabled ? cs['disabled'] : ''
          } ${className} ${error ? cs['error'] : ''}`}
        >
          <i className="fa fa-upload" />
          <span className={cs['control-text']}>
            {i18n['upload_file.placeholder']}
          </span>
          {!disabled ? (
            <input
              type="file"
              // multiple={multiple}
              className={cs['control-input']}
              onChange={this.onChange}
            />
          ) : (
            undefined
          )}
        </label>
        {maxHeight && maxWidth ? (
          <span className={cs['size-tips']}>{`${
            i18n['upload_file.size_tips']
          }${maxWidth}*${maxHeight}`}</span>
        ) : (
          undefined
        )}
        {srcList.map((value, i) => {
          const realFileName = value ? value.split('/').pop() : '';
          const ext = realFileName
            .split('.')
            .pop()
            .toLowerCase();
          const fileName = realFileName.replace(
            /(.*)_(.*)(\.\w+)$/,
            (m, name, randomstr, ext) => {
              return `${name}${ext}`;
            }
          );
          const url = encodeURI(value);
          return value ? (
            imageExtensions.includes(ext) ? (
              <div key={i} className={`${cs['wrapper']} ${itemClassName}`}>
                <a className={cs['image-value']} href={url} target="_blank">
                  <img src={url} onLoad={this.imageOnload} />
                </a>
                {linkDisabled ? (
                  <span className={cs['file-name']}>
                    {realFileName !== fileName
                      ? fileName
                      : i18n['upload.view_file']}
                  </span>
                ) : (
                  <a href={url} target="_blank" className={cs['file-name']}>
                    {realFileName !== fileName
                      ? fileName
                      : i18n['upload.view_file']}
                  </a>
                )}
                {removabled && !disabled ? (
                  <span
                    className={`fa fa-times ${cs['clear-btn']}`}
                    onClick={this.remove.bind(this, i)}
                  />
                ) : (
                  undefined
                )}
              </div>
            ) : (
              <div
                key={i}
                className={`${cs['wrapper']} ${
                  cs['text-wrapper']
                } ${itemClassName}`}
              >
                <i className="fa fa fa-paperclip" />
                {linkDisabled ? (
                  <span className={cs['text-value']}>
                    {realFileName !== fileName
                      ? fileName
                      : i18n['upload.view_file']}
                  </span>
                ) : (
                  <a className={cs['text-value']} href={url} target="_blank">
                    {realFileName !== fileName
                      ? fileName
                      : i18n['upload.view_file']}
                  </a>
                )}
                {removabled && !disabled ? (
                  <span
                    className={`fa fa-times ${cs['clear-btn']}`}
                    onClick={this.remove.bind(this, i)}
                  />
                ) : (
                  undefined
                )}
              </div>
            )
          ) : showDefaultImage ? (
            <div key={i} className={`${cs['wrapper']} ${itemClassName}`}>
              <a className={cs['image-value']}>
                <img src={defaultImage} />
              </a>
            </div>
          ) : (
            undefined
          );
        })}
      </div>
    );
  }
}

export default connect(
  null,
  {
    showTipsModal,
    showTopAlert
  }
)(UploadFile);
