import React, { Component } from "react";
import * as actions from "@/actions/Spread/recommendDetail";
import { connect } from "react-redux";
import i18n from "@/utils/i18n";
import moment from "moment";
import { DatePicker, Pagination, Popover } from "antd";
const { RangePicker,  } = DatePicker;
const { Provider, Consumer } = React.createContext({
    sstartDate: moment()
    .add(-1, "M")
    .valueOf(),
    endtDate: moment.now()
})
// 	{
// 		customerName: "PerformanceMark", //客户名称
// 		customerId: "23232sfdf23", //客户id
// 		email: "23232W@qq.com", //邮箱
// 		createTime: 21784231212, //创建时间（long）
// 		straightGuestNum: 4, //推荐直客数
// 		depostTotal: 32323.23, //入金总量
// 		dealTotal: 23244.22, //交易总量
// 		children: null
// 	}
const dateFormat = "YYYY-MM-DD";
export const LevelTable = connect(
	({ spread }) => {
		const { commendsPageData } = spread;
		return {
			commendsPageData
		};
	},
	{
		...actions
	}
)(
	class levelTable extends Component {
		state = {
			currentPage: 1,
			pageSize: 20,
			total: 0,
			startDate: moment()
				.add(-1, "M")
				.valueOf(),
			endtDate: moment.now()
		};
		ChildrenCache = {
			// 格式
			// customerId: {
			// 	data: [],
			// 	startDate,
			// 	endtDate
			// }
		};
		componentDidMount() {
			this.getPageData();
		}
		getPageData = () => {
			const { customerId } = this.props;
            const { currentPage, pageSize, startDate, endtDate } = this.state;
            this.ChildrenCache = {};
			this.props
				.getCommendsList({
					customerId, //客户id
					currentPage, //当前页
					pageSize, //每页数量
					startDate, //起始时间（long）
					endtDate //截止时间（long）
				})
				.then(({ result, data }) => {
					if (result) {
						const { total, pager } = data;
						this.setState({ total, currentPage: pager });
					}
				});
		};
		onPageChange = currentPage => {
			this.setState(
				{
					currentPage
				},
				this.getPageData
			);
		};
		onRangeChange = range => {
			this.setState(
				{
					startDate: range[0].valueOf(),
					endtDate: range[1].valueOf()
				},
				this.getPageData
			);
		};
		render() {
			const { startDate, endtDate, currentPage, pageSize, total } = this.state;
			const {
				commendsPageData: { list = [] }
            } = this.props;
			return (
				<div>
					<h3>{i18n["spread.detail.detail.title"]}</h3>
					<div>
						<RangePicker
							allowClear={false}
							defaultValue={[
								moment(moment(startDate).format(dateFormat), dateFormat),
								moment(moment(endtDate).format(dateFormat), dateFormat)
							]}
							format={dateFormat}
							onChange={this.onRangeChange}
						/>
						<Popover
							placement="right"
							content={i18n["spread.detail.detail.range.tip"]}
						>
							<a
								href="javascript:;"
								className="notice-popover"
								style={{ verticalAlign: "middle" }}
							>
								?
							</a>
						</Popover>
					</div>
					<br /> <br />
					<div class="ant-table ant-table-large ant-table-empty ant-table-scroll-position-left">
						<div class="ant-table-content">
							<div class="ant-table-body">
								<table>
									<thead className="ant-table-thead">
										<tr>
											<th>{i18n["spread.detail.table.customerName"]}</th>{" "}
											<th>{i18n["spread.detail.table.email"]}</th>{" "}
											{/* <th>{i18n["spread.detail.table.straightGuestNum"]}</th> */}
											<th>{i18n["spread.detail.table.depostTotal"]}</th>{" "}
											<th>{i18n["spread.detail.table.dealTotal"]}</th>{" "}
											<th>{i18n["spread.detail.table.createTime"]}</th>
										</tr>
									</thead>
									<tbody className="ant-table-tbody">
                                        <Provider value={this.state}>
                                            {list.map(row => {
                                                return (
                                                    <ChildTr
                                                        key={row.customerId}
                                                        {...{
                                                            row,
                                                            ChildrenCache: this.ChildrenCache,
                                                            startDate,
                                                            endtDate,
                                                            level: 0
                                                        }}
                                                    />
                                                );
                                            })}
                                        </Provider>
									</tbody>
								</table>
							</div>
							{!list ||
								(list.length === 0 && (
									<div class="ant-table-placeholder">
										{i18n["general.nodata"]}
									</div>
								))}
						</div>
					</div>
					<Pagination
						className="pagination"
						showQuickJumper
						defaultCurrent={1}
						current={currentPage}
						pageSize={pageSize}
						total={total}
						onChange={this.onPageChange}
					/>
				</div>
			);
		}
	}
);

const ChildTr = connect(
	null,
	{
		...actions
	}
)(
	class childTr extends Component {
		state = {
			hasChildren: false,
			expanded: false
		};
		onRequireing = false;
		trChild = [];
		componentDidMount() {
			this.getChildren();
		}
		componentWillReceiveProps(nextProps) {
			const {
				row: { customerId: nextCustomerId }
			} = nextProps;
			const {
				row: { customerId }
			} = this.props;
			// update children data
            this.getChildren(nextProps);
            
		}
		onExpand = () => {
			this.setState({
				expanded: !this.state.expanded
			});
		};

		getChildren(props = this.props) {
            console.log(1, props)
			if (this.onRequireing) return;
			this.onRequireing = true;
			const {
				row: { customerId },
				startDate,
				endtDate,
				ChildrenCache
			} = props;
			this.setState({ hasChildren: false });
            let rangeCache = ChildrenCache[customerId];
			rangeCache =
				rangeCache &&
				rangeCache.startDate === startDate &&
				rangeCache.endtDate === endtDate
					? rangeCache
                    : null; // 判断是否存在当前时间段的
			if (rangeCache) {
				this.updateChildTr(rangeCache.data);
				this.setState({
					hasChildren: rangeCache.data && rangeCache.data.length > 0
				});
				this.onRequireing = false;
			} else {
				this.props
					.getCommendChildList({
						customerId, //客户id
						startDate, //起始时间（long）
						endtDate //截止时间（long）
					})
					.then(({ result, data }) => {
						this.onRequireing = false;
						if (result) {
							this.updateChildTr(data);
							// 缓存所有请求成功的数据
							ChildrenCache[customerId] = {
								data,
								startDate,
								endtDate
							};
							if (data.length > 0) {
								this.setState({
									hasChildren: true
								});
							}
						}
					})
					.catch(e => {
						this.onRequireing = false;
					});
			}
		}
		updateChildTr = data => {
            const { startDate, endtDate, level, ChildrenCache } = this.props;
			this.trChild = data.map(row => {
				return (
                    <Consumer>
                        {state=>(
                            <ChildTr
                                {...{
                                    row,
                                    startDate: state.startDate,
                                    ChildrenCache,
                                    endtDate: state.endtDate,
                                    level: level + 1
                                }}
                            />

                        )}
                    </Consumer>
				);
			});
		};
		render() {
			const {
				row: {
					customerName, //客户名称
					customerId, //客户id
					email, //邮箱
					createTime, //创建时间（long）
					straightGuestNum, //推荐直客数
					phones,
					depostTotal, //入金总量
					dealTotal //交易总量
				},
				level
            } = this.props;
			const { expanded, hasChildren } = this.state;
			const listTr = (
				<tr key={customerId}>
					<td>
						{Array(level)
							.fill(1)
							.map((_, i) => (
								<span key={i} className="row-indent" />
							))}
						{hasChildren ? (
							<a
								href="javascript:;"
								className="row-expander"
								onClick={this.onExpand}
							>
								{this.state.expanded ? "-" : "+"}
							</a>
						) : (
							<span className="row-expander hidden" />
						)}
						{customerName}
					</td>
					<td> {email || (phones && phones.phoneStr) || ""}</td>
					{/* <td> {straightGuestNum}</td>  */}
					<td> {depostTotal}</td>
					<td> {dealTotal}</td>
					<td> {moment(createTime).format(dateFormat + " hh:mm:ss")}</td>
				</tr>
			);
			return !expanded ? listTr : [listTr, ...this.trChild];
		}
	}
);
export default LevelTable;
