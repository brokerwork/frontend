import Panel from "components/Panel";
import i18n from "utils/i18n";
import DateRangePicker from "components/DateRangePicker";
import Table from "components/Table";
import { dateRange } from "utils/config";
import cs from "./Demand.less";
import math from "utils/math";
import PaginationBar from "components/PaginationBar";

export default class Demand extends PureComponent {
  state = {
    range: dateRange.all,
    pageNo: 1,
    pageSize: 10
  };

  componentDidMount() {
    this.getDemandService();
  }

  getDemandService = () => {
    const { getDemandService } = this.props;
    const { range, pageNo, pageSize } = this.state;

    getDemandService({
      start: range.start.format("YYYYMM"),
      end: range.end.format("YYYYMM"),
      pager: pageNo,
      pageSize
    });
  };

  onDateRangeChange = range => {
    this.setState(
      {
        range
      },
      () => {
        this.getDemandService();
      }
    );
  };

  onPageChange = ({ pageNo, pageSize }) => {
    this.setState(
      {
        pageNo,
        pageSize
      },
      () => {
        this.getDemandService();
      }
    );
  };

  formatterDate = value => {
    return `${value.substr(0, 4)}/${value.substr(-2)}`;
  };

  render() {
    const { range } = this.state;
    const { demandService } = this.props;

    return (
      <Panel header={i18n["consumption.demand.title"]}>
        <div className="actions-bar">
          <div>
            <DateRangePicker
              formatStyle="YYYY-MM"
              needRange={false}
              minPanel="month"
              inline
              value={range}
              onChange={this.onDateRangeChange}
            />
          </div>
          <div className="text-right more">
            {i18n["consumption.live.total_count"]}
            {demandService.totalUsed}G
          </div>
        </div>
        <Table>
          <Table.Header>
            <th>{i18n["consumption.live.type"]}</th>
            <th>{i18n["consumption.live.base"]}</th>
            <th>{i18n["consumption.live.extras"]}</th>
            <th>{i18n["consumption.live.used"]}</th>
            <th>{i18n["consumption.live.month"]}</th>
          </Table.Header>
          <Table.Body>
            {demandService.list.map((item, idx) => {
              return (
                <tr key={idx}>
                  <td>{i18n["consumption.live.type_live"]}</td>
                  <td>{item.demandBase}G</td>
                  <td>{item.demandExtras}G</td>
                  <td>{item.video}G</td>
                  <td>{this.formatterDate(item.date)}</td>
                </tr>
              );
            })}
          </Table.Body>
        </Table>
        <PaginationBar
          onPageChange={this.onPageChange}
          total={demandService.total}
          pageSize={demandService.size}
          pageNo={demandService.pager}
        />
      </Panel>
    );
  }
}
