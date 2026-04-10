import cs from "./Usage.less";
import ProgressBar from "components/ProgressBar";
import i18n from "utils/i18n";

export default class Usage extends PureComponent {
  componentDidMount() {
    const { getUsageInfo } = this.props;

    getUsageInfo();
  }

  render() {
    const {
      usageInfo: {
        connectorUsed,
        connectorLimit,
        connectUsed,
        connectLimit,
        tradeAmountUsed,
        tradeAmountLimit
      }
    } = this.props;
    const tradeAmountPercent = tradeAmountLimit
      ? tradeAmountUsed / tradeAmountLimit * 100
      : 0;

    return (
      <div className={cs["usage"]}>
        <div className={cs["title"]}>{i18n["bridge.product.detail.usage"]}</div>
        <table className={cs["info-table"]}>
          <tbody>
            <tr>
              <th>{i18n["bridge.product.detail.usage.server"]}：</th>
              <td>
                {connectorUsed}/{connectorLimit}
              </td>
            </tr>
            <tr>
              <th>{i18n["bridge.product.detail.usage.real_time"]}：</th>
              <td>
                {connectUsed}/{connectLimit}
              </td>
            </tr>
            <tr>
              <th>{i18n["bridge.product.detail.usage.trade_amount"]}：</th>
              <td>
                {tradeAmountUsed}/{tradeAmountLimit}
                <ProgressBar now={0} className={cs["progress-bar"]} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
