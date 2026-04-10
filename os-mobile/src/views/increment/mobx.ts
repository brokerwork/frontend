import { observable, computed, action, autorun, flow } from "mobx";
import Ajax from "@/ajax";
import dayjs from "dayjs";
class IncrementState {
  @observable list = [
      {
        value: '',
          label: '',
      }
  ]
  @observable fee = ''
  @observable total = 0
  @observable showModal = false
  @action compute=(serviceId: string | number, num: number)=>{
      const item = this.serviceMap[serviceId]
      this.fee = item.price+'$'+ item.quantity+item.unit
      this.total = item.price*num
  }
  @action toggleModal = (isShow: boolean)=>{ 
      this.showModal = isShow
  }
  serviceMap:any = {}
  fetchList = flow(function*(tId, pId) {
    const rs = yield Ajax.get(`/v1/ops/product/vas/${tId}/${pId}`);
    this.list = rs.data.map((el: { serverId: string | number; price: any; quantity: any; vasType: { unit: any; }; message: { [x: string]: any; }; })=>{
        this.serviceMap[el.serverId] = {
            price: el.price,
            quantity: el.quantity,
            unit: el.vasType.unit
        }
        return {
            value: el.serverId,
            label: el.message['zh-CN'],
        }
    })
    
  });
  save = flow(function*(data, callback) {
    const rs = yield Ajax.post(`/v1/os/products/vas`, data);
    console.log('rs', rs)
    if(rs.result){
        callback()
    }
  });
}
export default new IncrementState();
