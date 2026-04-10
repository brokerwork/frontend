import * as React from 'react';
import { NavBar, Icon, SearchBar, Flex } from 'antd-mobile';
import accountListStore from './store';
import { observer, inject } from 'mobx-react';
import * as cs from './index.less';
import { connect } from '@/utils/connectStore';
import { typeList, productList } from './constant';
import ls, { TOKEN } from '@/utils/storage';

@inject('commonStore')
@observer
class AccountList extends React.Component {
  constructor(props) {
    super(props);
  }
  gotoDetail = (product, info) => {
    const {
      history: { push }
    } = this.props;
    const isOpen = info.product.includes(product);
    const tenantId = info.tenantId;
    // const productId = info.productId;
    isOpen &&
      push(
        `/product?tenantId=${tenantId}&productId=${product}&overdue=${!info
          .openedProducts[product]}`
      );
  };
  onChange = value => {
    this.props.accountListStore.onChange(value);
  };
  onSubmit = value => {
    const params = {
      nowPage: 1, // 固定传1
      pageSize: 10000, // 固定传一个比较大的值，比如1w
      keyword: value // 租户ID
    };
    this.props.accountListStore.getInfo(params);
  };
  logout = () => {
    this.props.commonStore.logout(ls.get(TOKEN));
  };
  render() {
    const {
      accountListStore: { accountInfo },
      commonStore: { userRights }
    } = this.props;
    // TENANT_BASE_VIEW_MY TENANT_BASE_VIEW_ALL
    const hasRights = userRights.some(right =>
      ['TENANT_BASE_VIEW_MY', 'TENANT_BASE_VIEW_ALL'].includes(right)
    );
    // 'TENANT_PRODUCT', 'TENANT_PRODUCT_VIEW'
    const hasViewProductRight =
      userRights.some(right => 'TENANT_PRODUCT' === right) &&
      userRights.some(right => 'TENANT_PRODUCT_VIEW' === right);
    return (
      <div>
        <NavBar
          mode="light"
          rightContent={
            <span onClick={this.logout} className={cs.quite}>
              退出
            </span>
          }
        >
          租户列表
        </NavBar>
        <div>
          <SearchBar
            value={accountListStore.rentId}
            placeholder="请输入租户ID"
            onSubmit={this.onSubmit}
            showCancelButton
            onChange={this.onChange}
          />
          {!hasRights ? (
            <div className={cs.empty}>没有权限搜索用户，请联系管理员</div>
          ) : accountInfo && accountInfo.length ? (
            accountInfo.map((info, index) => (
              <div key={index} className={cs.searchContent}>
                <div className={cs.info}>
                  <h1>{info.tenantName}</h1>
                  <Flex justify="between">
                    <span>编号：{info.tenantId}</span>
                    <span>{typeList[info.type]}</span>
                  </Flex>
                </div>
                {hasViewProductRight && (
                  <div className={cs.balance}>
                    <p>账户余额（$）：{info.balance.toFixed(2)}</p>
                    {productList.map(pro => (
                      <div
                        className={cs.balanceItem}
                        key={pro}
                        onClick={this.gotoDetail.bind(this, pro, info)}
                      >
                        <span
                          className={
                            info.openedProducts[pro]
                              ? cs.squareEnabled
                              : cs.squareDisabled
                          }
                        >
                          {pro}
                        </span>
                        <span>
                          {!info.product.includes(pro)
                            ? '未开通'
                            : info.openedProducts[pro]
                            ? '使用中'
                            : '已过期'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={cs.empty}>请搜索租户</div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(
  'accountListStore',
  accountListStore
)(AccountList);
