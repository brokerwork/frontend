import Panel from "components/Panel";
import ProgressBar from "components/ProgressBar";
import CircleProgress from "components/CircleProgress";
import cs from "./VideoService.less";
import moment from "moment";
import math from "utils/math";
import i18n from "utils/i18n";
import { NavLink } from "react-router-dom";

export default class VideoService extends PureComponent {
  componentDidMount() {
    const { getVideoService } = this.props;

    getVideoService();
  }

  render() {
    const {
      videoService: {
        liveCurrentBase = 0,
        liveExpiredDate,
        demandCurrentBase = 0,
        demandExpiredDate,
        usedStorage = 0,
        storage = 0,
        liveTotal = 0,
        liveExtras = 0,
        liveUsed = 0,
        liveRemain = 0,
        demandTotal = 0,
        demandExtras = 0,
        demandUsed = 0,
        demandRemain = 0,
        liveExpired,
        demandExpired,
        liveEnabled,
        demandEnabled
      }
    } = this.props;
    const storageUsedPercent = usedStorage / storage;
    const warningStorage = storageUsedPercent >= 0.9;
    const alertStorage = storageUsedPercent >= 1;

    if (!liveEnabled && !demandEnabled) return null;

    return (
      <Panel header={i18n["dashboard.video.title"]}>
        <div className={cs["container"]}>
          <div className={cs["summary-box"]}>
            <div className={cs["title"]}>{i18n["broker.live.summary"]}</div>
            <div className={cs["content"]}>
              <table className={cs["info-table"]}>
                <tbody>
                  {liveEnabled ? (
                    <tr>
                      <th>{i18n["dashboard.video.live_version"]}</th>
                      <td>
                        {liveCurrentBase}G / {i18n["broker.live.month"]}
                      </td>
                      <th>{i18n["dashboard.video.expired_date"]}</th>
                      <td>{liveExpiredDate}</td>
                    </tr>
                  ) : (
                    undefined
                  )}
                  {demandEnabled ? (
                    <tr>
                      <th>{i18n["dashboard.video.demand_version"]}</th>
                      <td>
                        {demandCurrentBase}G / {i18n["broker.live.month"]}
                      </td>
                      <th>{i18n["dashboard.video.expired_date"]}</th>
                      <td>{demandExpiredDate}</td>
                    </tr>
                  ) : (
                    undefined
                  )}
                  {demandEnabled ? (
                    <tr>
                      <th>{i18n["dashboard.video.storage"]}</th>
                      <td colSpan="3">
                        <ProgressBar
                          sm
                          className={cs["progress-bar"]}
                          now={storageUsedPercent * 100}
                          type={
                            alertStorage
                              ? "error"
                              : warningStorage ? "warning" : "primary"
                          }
                        />
                        <span
                          className={
                            alertStorage
                              ? "text-danger"
                              : warningStorage ? "text-warning" : ""
                          }
                        >
                          {usedStorage}G / {storage}G
                        </span>
                      </td>
                    </tr>
                  ) : (
                    undefined
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className={cs["usage-box"]}>
            <div className={cs["title"]}>
              {i18n["dashboard.video.usage"]}
              <div className={cs["more"]}>
                {/* <NavLink to="/home/consumption">
                  {i18n["broker.live.more"]}
                </NavLink> */}
              </div>
            </div>
            <div className={cs["content"]}>
              {liveEnabled ? (
                <div className={`${cs["box"]} ${cs["live-box"]}`}>
                  <div className={cs["box-title"]}>
                    <i className="fa fa-tv" />
                    <span>{i18n["dashboard.video.live"]}</span>
                    {liveExpired ? (
                      <span className="text-danger">
                        {i18n["dashboard.video.expired"]}
                      </span>
                    ) : (
                      undefined
                    )}
                  </div>
                  <CircleProgress
                    value={liveRemain / liveTotal}
                    color="#1fb5ad"
                  >
                    <div className={cs["circle-progress-text"]}>
                      <span>{i18n["dashboard.video.reamin"]}</span>
                      <span className={cs["number"]}>{liveRemain}G</span>
                      {liveRemain <= 0 ? (
                        <span className="text-danger">
                          {i18n["dashboard.video.empty"]}
                        </span>
                      ) : (
                        undefined
                      )}
                    </div>
                  </CircleProgress>
                  <div className={cs["summary"]}>
                    <div className={cs["summary-part"]}>
                      <span>{i18n["dashboard.video.total"]}</span>
                      <span className={cs["number"]}>{liveTotal}G</span>
                    </div>
                    <div className={cs["summary-part"]}>
                      <span>{i18n["dashboard.video.extras"]}</span>
                      <span className={cs["number"]}>{liveExtras}G</span>
                    </div>
                    <div className={cs["summary-part"]}>
                      <span>{i18n["dashboard.video.used"]}</span>
                      <span className={cs["number"]}>{liveUsed}G</span>
                    </div>
                  </div>
                </div>
              ) : (
                undefined
              )}
              {demandEnabled ? (
                <div className={`${cs["box"]} ${cs["demand-box"]}`}>
                  <div className={cs["box-title"]}>
                    <i className="fa fa-tv" />
                    <span>{i18n["dashboard.video.demand"]}</span>
                    {demandExpired ? (
                      <span className="text-danger">
                        {i18n["dashboard.video.expired"]}
                      </span>
                    ) : (
                      undefined
                    )}
                  </div>
                  <CircleProgress
                    value={demandRemain / demandTotal}
                    color="#fc445B"
                  >
                    <div className={cs["circle-progress-text"]}>
                      <span>{i18n["dashboard.video.reamin"]}</span>
                      <span className={cs["number"]}>{demandRemain}G</span>
                      {demandRemain <= 0 ? (
                        <span className="text-danger">
                          {i18n["dashboard.video.empty"]}
                        </span>
                      ) : (
                        undefined
                      )}
                    </div>
                  </CircleProgress>
                  <div className={cs["summary"]}>
                    <div className={cs["summary-part"]}>
                      <span>{i18n["dashboard.video.total"]}</span>
                      <span className={cs["number"]}>{demandTotal}G</span>
                    </div>
                    <div className={cs["summary-part"]}>
                      <span>{i18n["dashboard.video.extras"]}</span>
                      <span className={cs["number"]}>{demandExtras}G</span>
                    </div>
                    <div className={cs["summary-part"]}>
                      <span>{i18n["dashboard.video.used"]}</span>
                      <span className={cs["number"]}>{demandUsed}G</span>
                    </div>
                  </div>
                </div>
              ) : (
                undefined
              )}
            </div>
          </div>
        </div>
      </Panel>
    );
  }
}
