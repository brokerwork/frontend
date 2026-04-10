import Button from "components/Button";
import Table from "components/Table";
import i18n from "utils/i18n";
import cs from "./BasicInfo.less";
import moment from "moment";

export default class BasicInfo extends PureComponent {
  componentDidMount() {
    const { getProductInfo } = this.props;

    getProductInfo();
  }

  refresh = () => {
    const { refreshApiToken, getProductInfo } = this.props;

    refreshApiToken().then(({ result }) => {
      if (result) {
        getProductInfo();
      }
    });
  };

  render() {
    const {
      productInfo: {
        tenantId,
        productVersionName,
        apiUrl,
        apiDocUrl,
        createTime,
        expireTime,
        apiToken
      }
    } = this.props;

    return (
      <div className={cs["basic-info"]}>
        <div className={cs["title"]}>{i18n["product.detail.base.title"]}</div>
        <table className={cs["info-table"]}>
          <tbody>
            <tr>
              <th>{i18n["dashboard.tenant.id"]}：</th>
              <td>{tenantId}</td>
            </tr>
            <tr>
              <th>{i18n["product.detail.access.url"]}：</th>
              <td>{apiUrl}</td>
            </tr>
            <tr>
              <th>{i18n["product.detail.version"]}：</th>
              <td>{productVersionName}</td>
            </tr>
            <tr>
              <th>{i18n["product.detail.create.time"]}：</th>
              <td>
                {createTime
                  ? moment(createTime).format("YYYY-MM-DD HH:mm:ss")
                  : ""}
              </td>
            </tr>
            <tr>
              <th>{i18n["product.detail.exipred.time"]}：</th>
              <td>
                {expireTime
                  ? moment(expireTime).format("YYYY-MM-DD HH:mm:ss")
                  : ""}
              </td>
            </tr>
            <tr>
              <th>API Token：</th>
              <td>
                {apiToken}{" "}
                {apiToken ? (
                  <a onClick={this.refresh}>
                    {i18n["product.detail.btn.reset"]}
                  </a>
                ) : (
                  ""
                )}
                {apiToken
                  ? ` (${i18n["product.detail.apikey.reset.tip"]})`
                  : ""}
              </td>
            </tr>
            <tr>
              <th>{i18n["product.detail.api.doc"]}：</th>
              <td>
                <a href={apiDocUrl} target="_blank">
                  {apiDocUrl}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
