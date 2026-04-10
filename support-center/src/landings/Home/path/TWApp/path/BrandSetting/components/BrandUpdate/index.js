import i18n from 'utils/i18n';
import UploadFile from 'components/UploadFile';
import cs from './BrandUpdate.less';
import Button from 'components/Button';


export default class BrandUpdate extends PureComponent {
  componentDidMount() {
    const { getBrandInfo } = this.props;
    Promise.resolve(getBrandInfo()).then(() => {
      const {brandInfo} = this.props;
      this.setState({
        previewLgImage: brandInfo[0] ?  brandInfo[0].url : '',
        previewSmImage: brandInfo[1] ? brandInfo[1].url : '',
      });
    });
  }

  constructor(props) {
    super(props);
    const {brandInfo} = this.props;
    this.state = {
      previewLgImage: brandInfo[0] ?  brandInfo[0].url : '',
      previewSmImage: brandInfo[1] ? brandInfo[1].url : '',
    };
  }

  setPreviewImage = (size, data) => {
    this.setState({
      [`preview${size}Image`]: data
    });
  }
  clearImg = () => {
    const {brandInfo} = this.props;
    this.setState({
      previewLgImage: brandInfo[0] && brandInfo[0].url || '',
      previewSmImage: brandInfo[1] && brandInfo[1].url || '',
    });
  }

  save =() => {
    const {saveBrandInfo, showTopAlert} = this.props;
    const {previewLgImage, previewSmImage} = this.state;
    let data = [{
      'px': '1242*2208',
      'url': previewLgImage
    },
    {
      'px': '640*960',
      'url': previewSmImage
    }];
    saveBrandInfo(data).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.save_success']
        });
      }
    });
  }

  render() {
    const {previewLgImage, previewSmImage} = this.state;
    return (
      <div className={cs['container']}>
      <div className={cs['started-page-title']}>{i18n['twapp.brand_setting.title']}</div>
      <div className={cs['start-page-content']}>
        <div className={cs['preview-content']}>
          <div className={cs['started-page-progress']}>{i18n['twapp.brand_setting.preview']}</div>
          <div className={cs['phone-preview']}>
              <div className={cs['iphone']}>
                {previewLgImage
                  ? <img src={previewLgImage} className={cs['iphone-previve']} />
                  : undefined
                }
              </div>
          </div>
        </div>
        <div className={cs['upload-content']}>
          <div className={cs['upload-header']}>
            <div className={cs['left-tips']}>{i18n['twapp.brand_setting.upload']}</div>
            {(previewLgImage && previewSmImage) || (previewLgImage === '' && previewSmImage=== '')
              ? <Button className={cs['right-upload-btn']} onClick={this.clearImg}>
                    {i18n['general.cancel']}
                </Button>
              : undefined
            }
            {(previewLgImage && previewSmImage)  || (previewLgImage === '' && previewSmImage=== '')
              ? <Button style="primary" className={`${cs['right-upload-btn']} $cs[left]`} onClick={this.save}>
                    {i18n['general.save']}
                </Button>
              : undefined
            }
          </div>
          <div className={cs['upload-container']}>
              <div className={cs['left-container']}>
                <div className={cs['size-tag']}>1242*2208</div>
                <UploadFile 
                  onlyImage={true} 
                  showDefaultImage={true}
                  value={previewLgImage}
                  maxHeight={2208}
                  maxWidth={1242}
                  onChange={this.setPreviewImage.bind(this, 'Lg')}
                  previewClass={cs['preview-image-lg']}
                />
              </div>
              <div className={cs['right-container']}>
                <div className={cs['size-tag']}>640*960</div>
                <UploadFile 
                  onlyImage={true} 
                  value={previewSmImage}
                  maxHeight={960}
                  maxWidth={640}
                  onChange={this.setPreviewImage.bind(this, 'Sm')}
                  showDefaultImage={true}
                  previewClass={cs['preview-image-sm']} 
                />
              </div>
          </div>
        </div>
      </div>
      </div>      
    );
  }
}