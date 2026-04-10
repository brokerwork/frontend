import ContentWrapper from "components/ContentWrapper";
import i18n from "utils/i18n";
import BasicInfo from "../../containers/BasicInfo";
import cs from "./Root.less";

export default class Root extends PureComponent {
  render() {
    return (
      <ContentWrapper header={i18n["left.menu.product.detail"]}>
        <div className={cs["container"]}>
          <BasicInfo />
        </div>
      </ContentWrapper>
    );
  }
}
