/* eslint-disable no-unused-vars */
import * as React from 'react';
import * as cs from './product.less';
import state from './mobx';
import { observer, inject } from 'mobx-react';
import { NavBar, Icon, Card, WhiteSpace } from 'antd-mobile';
import { Link } from 'react-router-dom';
import query from '@/utils/query';

@inject('commonStore')
@observer
class Login extends React.Component {
  constructor(props) {
    super(props);
    state.fetchInfo(query.get('tenantId'), query.get('productId'));
  }
  render() {
    const tId = query.get('tenantId');
    const pId = query.get('productId');
    const overdue = query.get('overdue') === 'true';
    const { product, service } = state;
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.goBack()}
        >
          {query.get('productId')}详情
        </NavBar>
        <div className={cs.content}>
          <Card>
            <Card.Header title={product.name} />
            <Card.Body className={cs.body}>
              <div>开通类型：{product.type}</div>
              <div>开通：{product.open}</div>
              <div>到期：{product.end}</div>
              <div>版本：{product.version}</div>
              <div>地址：{product.add}</div>
              <div>随机地址：{product.productDomain}</div>
            </Card.Body>
          </Card>
          <WhiteSpace size="lg" />
          <Card>
            <Card.Header title="用户包" />
            <Card.Body className={cs.body}>
              <div>基础量：{service.basic}</div>
              <div>增值包：{service.increase}</div>
              <div>已使用：{service.used}</div>
            </Card.Body>
          </Card>
        </div>

        {this.props.commonStore.userRights.includes('TENANT_PRODUCT_CONF') && (
          <div className={cs.footer}>
            <div style={{ width: overdue ? '100%' : '50%' }}>
              <Link
                to={`/renew?tenantId=${tId}&productId=${pId}&expired=${product.expired}`}
              >
                续费
              </Link>
            </div>
            {!overdue && (
              <div>
                <Link to={`/increment?tenantId=${tId}&productId=${pId}`}>
                  增值服务
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
export default Login;
