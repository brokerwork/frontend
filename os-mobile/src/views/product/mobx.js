import { observable, flow } from 'mobx';
import Ajax from '@/ajax';
import dayjs from 'dayjs';
import translation from './constants';
class ProductState {
  @observable product = {
    name: '',
    type: '',
    open: '',
    end: '',
    version: '',
    add: '',
    productDomain: '',
    expired: ''
  };
  @observable service = {
    basic: 0,
    used: 0,
    increase: 0
  };
  fetchInfo = flow(function*(tId, pId) {
    const rs = yield Ajax.get(`/v1/os/products/detail/${tId}/${pId}`);
    this.product = {
      name: translation[rs.data.topVersionId],
      type: translation[rs.data.productType],
      open: dayjs(rs.data.started).format('YYYY-MM-DD HH:mm:ss'),
      end: dayjs(rs.data.expired).format('YYYY-MM-DD HH:mm:ss'),
      version: rs.data.versionName,
      add: rs.data.customeDomain,
      productDomain: rs.data.productDomain,
      expired: rs.data.expired
    };
    this.service = {
      basic: rs.data.user.base,
      used: rs.data.user.used,
      increase: rs.data.user.attach
    };
  });
}
export default new ProductState();
