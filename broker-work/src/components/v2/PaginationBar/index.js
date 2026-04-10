import { Pagination } from 'lean-ui';
import cs from './index.less';
import i18n from 'utils/i18n';

export default ({ className, onPageChange, pageNo, pageSize, total, size }) => (
  <div className={cs['page']}>
    <Pagination
      showQuickJumper
      showSizeChanger
      total={total}
      pageSize={pageSize}
      defaultCurrent={pageNo}
      current={pageNo}
      onChange={page => onPageChange({ pageNo: page, pageSize })}
      onShowSizeChange={(pageNo, pageSize) =>
        onPageChange({ pageNo, pageSize })
      }
      className={className}
      size={size}
      locale={{
        items_per_page: i18n['pagination.items_per_page'],
        custom_per_page: i18n['pagination.custom_per_page'],
        custom_page_max: i18n['pagination.placeholder'],
        jump_to: i18n['pagination.jump_to'],
        page: i18n['pagination.page'],
        prev_page: i18n['pagination.prev_page'],
        next_page: i18n['pagination.next_page'],
        prev_5: i18n['pagination.prev_5'],
        next_5: i18n['pagination.next_5'],
        prev_3: i18n['pagination.prev_3'],
        next_3: i18n['pagination.next_3']
      }}
    />
  </div>
);
