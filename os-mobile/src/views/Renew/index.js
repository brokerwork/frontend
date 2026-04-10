import * as React from 'react';
import {
  NavBar,
  Icon,
  InputItem,
  Switch,
  TextareaItem,
  List
} from 'antd-mobile';
import rennewStore from './store';
import { observer, inject } from 'mobx-react';
import cs from './index.less';
import { connect } from '@/utils/connectStore';
import RennewFormWrapper from './RenewForm';
import query from '@/utils/query';

@inject('commonStore')
@observer
class Rennew extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.goBack()}
        >
          {query.get('productId')}续费
        </NavBar>
        <div>
          <RennewFormWrapper {...this.props} />
        </div>
      </div>
    );
  }
}
export default connect(
  'rennewStore',
  rennewStore
)(Rennew);
