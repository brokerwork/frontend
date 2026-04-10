import { Loading, Dialog } from 'lean-ui';

import cs from './Loading.less';
//由于组件zIndex的问题 用dialog实现
export default ({ show }) => (
  <Dialog
    maskStyle={{
      background: 'rgba(255,255,255,0.5)'
    }}
    visible={show}
    footer={null}
    closable={false}
    className={cs['loading-dialog']}
  >
    <Loading />
  </Dialog>
);
