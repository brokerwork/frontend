import List from '../../../../containers/RealAccountSettingList';
import { realAccountColumns } from '../../constant';
import cs from './index.less';

export default class StepList extends PureComponent {
  render() {
    const {
      className = '',
      sortableData,
      dissortableData,
      title,
      isEnabled,
      type,
      onSort,
      children,
      isVisibleShow
    } = this.props;
    return (
      <div className={`${cs.container} ${className}`}>
        <p className={cs.title}>
          {title}
          {children}
        </p>
        <List
          columns={realAccountColumns}
          sortableData={sortableData}
          dissortableData={dissortableData}
          isEnabled={isEnabled}
          onSort={onSort}
          type={type}
          isVisibleShow={isVisibleShow}
        />
      </div>
    );
  }
}
