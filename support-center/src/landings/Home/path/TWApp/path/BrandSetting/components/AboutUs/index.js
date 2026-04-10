import i18n from "utils/i18n";
import Button from "components/Button";

import cs from "./styles.less";

export default class AboutUs extends PureComponent {
  maxSize = 5000; // 最长不超过5000字
  componentDidMount() {
    const { getData } = this.props;
    getData();
  }
  onEditorChange = e => {
    const { modifyData } = this.props;
    modifyData(e.target.value);
  };
  onSubmit = () => {
    const { setData, data } = this.props;
    setData(data);
  };
  render() {
    const { data, type } = this.props;
    return (
      <div className={cs["container"]}>
        <div className={cs["previewZone"]}>
          <div className={`${cs["editorPreview"]} ${cs[`previewbg_${type}`]}`}>
            <div className={cs["editorPreviewContent"]}>
              <textarea disabled={true} value={data} />
            </div>
          </div>
        </div>
        <div className={cs["editorZone"]}>
          <textarea
            className={`form-control ${cs["editor"]}`}
            placeholder={i18n[`twapp.brand_setting.${type}_placeholder`]}
            onChange={this.onEditorChange}
            maxLength={this.maxSize}
            value={data}
          />
          <div className={cs["chartNumber"]}>
            <span>{`${data.length}/${this.maxSize}`}</span>
          </div>
          <div className={cs["submitBtn"]}>
            <Button size="large" onClick={this.onSubmit} style="primary">
              {i18n["general.save"]}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
