import { FormattedMessage } from 'react-intl';
import cs from './UploadFile.less';
import i18n from 'utils/i18n';
import { 
  fileExtensions as FILE_EXTENSIONS, 
  imageExtensions as IMAGE_EXTENSIONS, 
  uploadSizeLimit as UPLOAD_SIZE_LIMIT
} from 'utils/config';
import defaultImage from 'assets/images/default.png';
import upload from './upload';
import ViewImage from './Image';
import File from './File';
import Uploading from './Uploading';


export default class UploadFile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileExtensions: props.fileExtensions || FILE_EXTENSIONS,
      imageExtensions: props.imageExtensions || IMAGE_EXTENSIONS,
      uploadSizeLimit: props.uploadSizeLimit || UPLOAD_SIZE_LIMIT,
      uploading: false,
      uploadProgress: 0,
      fileType: '',
      abort: false
    };
  }

  onChange = (evt) => {
    const file = evt.target.files[0];

    evt.target.value = '';
    this.readFile(file);
  }

  clear = () => {
    const { onChange } = this.props;

    if (onChange) onChange('');
  }

  remove = (key) => {
    const { value, onChange } = this.props;
    const result = [].concat(value);

    result.splice(key, 1);

    if (onChange) onChange(result);
  }

  handleUploadSuccess = (fileSrc) => {
    const { onChange, multiple, value } = this.props;
    const result = multiple ? [...value, fileSrc] : fileSrc;

    if (onChange) onChange(result);
  }

  readFile = (file) => {
    const { showTopAlert, onlyImage } = this.props;

    if (typeof FileReader === 'undefined') {
      showTopAlert({
        content: i18n['upload.brower_support']
      });
      return false;
    }

    const { fileExtensions, imageExtensions } = this.state;
    const {maxHeight, maxWidth} = this.props;
    const validFileExtensions = onlyImage ? imageExtensions : fileExtensions;
    const fileReader = new FileReader();
    const fileName = file.name;
    const that = this;
    const isValidFileType = validFileExtensions.some((extension) => {
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
    fileReader.readAsDataURL(file);
    fileReader.onload = function() {
      const fileSrc = this.result;
      if (onlyImage) {
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
            that.setState({
              uploading: true
            }, () => {
              that.upload(file, fileSrc);
            });
          } else {
            showTopAlert({
              content: i18n['upload_file.size_error']
            });
          }
        };
      } else {
        that.upload(file, fileSrc);
      }
    };
    fileReader.onabort = () => {
      showTopAlert({
        content: i18n['upload.error.abort']
      });
    };
    fileReader.onerror = () => {
      showTopAlert({
        content: i18n['upload.error.read_error']
      });
    };
  }

  upload = (file) => {
    const { showTopAlert, keepOriginalName } = this.props;
    const fileSize = file.size;
    const fileName = file.name;
    let { uploadSizeLimit, imageExtensions } = this.state;
    const ext = fileName.split('.').pop().toLowerCase();
    const fileType = imageExtensions.includes(ext) ? 'image' : 'file';
    if(fileType==='file'){
      uploadSizeLimit = uploadSizeLimit*2
    }
    if (fileSize > uploadSizeLimit) {
      const size = `${uploadSizeLimit / 1024 / 1024}MB`;

      showTopAlert({
        content: (
          <FormattedMessage
            id="upload.upload_size"
            defaultMessage={i18n['upload.upload_size']}
            values={{
              size
            }}
          />
        )
      });

      return false;
    }
    this.setState({
      fileType,
      uploading: true
    });

    upload({
      keepOriginalName,
      fileName,
      file,
      onSuccess: (fileSrc) => {
        const { abort } = this.state;

        if (!abort) {
          showTopAlert({
            style: 'success',
            content: i18n['upload.upload_success']
          });
          this.setState({
            uploading: false,
            uploadProgress: 0
          }, () => {
            this.handleUploadSuccess(fileSrc);
          });
        }
      },
      onFail: () => {
        showTopAlert({
          content: i18n['upload.upload_fail']
        });
      },
      onProgress: (progress) => {
        this.setState({
          uploadProgress: progress
        });
      }
    });
  }

  abort = () => {
    this.setState({
      uploading: false,
      uploadProgress: 0,
      abort: true
    });
  }

  _renderSingleFile() {
    const { value, removable = true, previewClass = '' } = this.props;
    const { imageExtensions } = this.state;
    const fileName = value ? value.split('/').pop() : '';
    const ext = fileName.split('.').pop().toLowerCase();

    return value
      ? imageExtensions.includes(ext)
        ? <ViewImage
            value={value} 
            removable={removable}
            onRemove={this.clear}
            previewClassName={previewClass}
          />
        : <File
            value={value}
            removable={removable}
            onRemove={this.clear}
          />
      : undefined;
  }

  _renderMultipleFiles() {
    const { value = [], removable = true } = this.props;
    const { imageExtensions } = this.state;

    return (value || []).map((url, idx) => {
      const fileName = url.split('/').pop();
      const ext = fileName.split('.').pop().toLowerCase();

      return imageExtensions.includes(ext)
        ? <ViewImage
            key={idx}
            value={url} 
            removable={removable}
            onRemove={this.remove.bind(this, idx)}
          />
        : <File
            key={idx}
            value={url}
            removable={removable}
            onRemove={this.remove.bind(this, idx)}
          />;
    });
  }

  render() {
    let {
      disabled, error, className = '',
      itemClassName = '', multiple,
      value, maxLength = 10, showItem = true
    } = this.props;
    const { uploading, uploadProgress, fileType } = this.state;
    
    disabled = disabled || multiple && value.length === maxLength;

    return (
      <div>
        <label className={`${cs['control']} ${disabled ? cs['disabled'] : ''} ${className} ${error ? cs['error'] : ''}`}>
          <i className="fa fa-upload"></i>
          <span className={cs['control-text']}>{i18n['upload_file.placeholder']}</span>
          {!disabled
            ? <input type="file" className={cs['control-input']} onChange={this.onChange} />
            : undefined}
        </label>
        <div className={`item-list ${cs['item-list']} ${itemClassName}`}>
          {showItem
            ? multiple
              ? this._renderMultipleFiles()
              : this._renderSingleFile()
            : undefined}
          {uploading
            ? <Uploading 
                progress={uploadProgress} 
                type={fileType} 
                onAbort={this.abort}
              />
            : undefined}
          {multiple && value.length !== 0 && !disabled
            ? <label className={`image-control ${cs['image-control']}`}>
                <i className={`fa fa-plus ${cs['image-control-icon']}`}></i>
                <input type="file" className={cs['control-input']} onChange={this.onChange} />
              </label>
            : undefined}
        </div>
      </div>
    );
  }
}