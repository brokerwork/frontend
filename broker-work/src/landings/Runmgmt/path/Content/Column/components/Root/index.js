import PagePanel from 'components/PagePanel';
import { Button, Table as UiTable, Icon, Message } from 'lean-ui';
import { DragDropContextProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import i18n from 'utils/i18n';
import cs from './styles.less';
import { COLUMN_COLUMNS } from '../../../../../constants';
import _ from 'lodash';
import EditColumnTitleContent from './EditColumnTitle';
const { Td, Th } = UiTable;

// This can be any component you want
function dragDirection(
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
}
class BodyRow extends React.Component {
  render() {
    const {
      data,
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      dragRow,
      clientOffset,
      sourceClientOffset,
      initialClientOffset,
      editColumnBanner,
      editColumnTitle,
      toggleEnable,
      ...restProps
    } = this.props;
    let className;
    if (isOver && initialClientOffset) {
      const direction = dragDirection(
        dragRow.index,
        restProps.index,
        initialClientOffset,
        clientOffset,
        sourceClientOffset
      );
      if (direction === 'downward') {
        className = 'drop-over-downward';
      }
      if (direction === 'upward') {
        className = 'drop-over-upward';
      }
    }
    return connectDragSource(
      connectDropTarget(
        <tr className={cs[`${className}`]}>
          <Td>
            <Icon icon="hamburger-table" className={cs['drag-icon']} />
          </Td>
          <Td>{data && data.order}</Td>
          <Td>{data && data.name}</Td>
          <Td>
            {data && data.enable
              ? i18n['runmgmt.app_content.column.enabled']
              : i18n['runmgmt.app_content.column.disabled']}
          </Td>
          <Td>
            {data && !data.enable ? (
              <Button
                type="primary"
                size="small"
                onClick={toggleEnable.bind(this, data)}
              >
                {i18n['runmgmt.app_content.column.mark_enabled']}
              </Button>
            ) : (
              <Button
                size="small"
                className={cs['actions-button']}
                onClick={toggleEnable.bind(this, data)}
              >
                {i18n['runmgmt.app_content.column.mark_disabled']}
              </Button>
            )}
            {data &&
              data.code === 'INFO_ARTICLE' && (
                <Button
                  size="small"
                  type="primary"
                  className={cs['action-button']}
                  onClick={editColumnBanner.bind(this, data)}
                >
                  {i18n['runmgmt.app_content.column.bannermgmt']}
                </Button>
              )}
            {data &&
              data.code === 'INFO_ARTICLE' && (
                <Button
                  size="small"
                  type="primary"
                  className={cs['action-button']}
                  onClick={editColumnTitle.bind(this, data)}
                >
                  {i18n['general.edit']}
                </Button>
              )}
          </Td>
        </tr>
      )
    );
  }
}

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index
    };
  }
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};
const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset()
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset()
  }))(BodyRow)
);

class DragSortingTable extends React.Component {
  renderHeadCell = ({ item, index, fixed }) => {
    return (
      <Th key={index} fixed={fixed}>
        {item.label}
      </Th>
    );
  };
  editColumnBanner = v => {
    const {
      history: { push }
    } = this.props;
    push('/runmgmt/content/banners');
  };
  
  toggleEnableConfirm = item => {
    const { showTipsModal } = this.props;
    if (!item.enable) {
      this.toggleEnable(item);
      return;
    }
    showTipsModal({
      content: (
        <div className={cs['tipsModalContent']}>
          {i18n['runmgmt.app_content.column.disabled_tips']}
        </div>
      ),
      onConfirm: cb => {
        cb();
        this.toggleEnable(item);
      }
    });
  };
  toggleEnable = item => {
    const { enableColumn, getColumns } = this.props;
    enableColumn({
      code: item.code,
      status: Number(!item.enable)
    }).then(r => {
      if (!r.result) return;
      getColumns();
    });
  };
  editColumnTitle = item => {
    const { editColumnTitle, showTipsModal, getColumns } = this.props;
    this.__columnTitle__ = item.name;
    showTipsModal({
      header: i18n['runmgmt.app_content.column.modify_name.header'],
      content: (
        <EditColumnTitleContent
          onChange={this.onColumnTitleChange}
          value={this.__columnTitle__}
        />
      ),
      onConfirm: cb => {
        if (!this.__columnTitle__) {
          Message.error(i18n['runmgmt.app_content.column.modify_name.error']);
          return;
        }
        if (this.__columnTitle__.length > 4) {
          Message.error(
            i18n['runmgmt.app_content.column.modify_name.size_error']
          );
          return;
        }
        cb();
        editColumnTitle({
          code: item.code,
          name: this.__columnTitle__
        }).then(r => {
          if (!r.result) return;
          getColumns();
        });

        this.__columnTitle__ = null;
      }
    });
  };
  _moveRow = (dragIndex, hoverIndex) => {
    const { data, sortList } = this.props;
    let copyData = _.cloneDeep(data);
    const dragRow = data[dragIndex];
    copyData.splice(dragIndex, 1);
    copyData.splice(hoverIndex, 0, dragRow);
    sortList(copyData, data);
  };
  _renderTbody = () => {
    const { data } = this.props;
    return (
      <tbody>
        {data.map((item, index) => {
          if (item && !item.enable) {
            return (
              <tr>
                <Td />
                <Td>{item.order}</Td>
                <Td>{item.name}</Td>
                <Td>
                  {item.enable
                    ? i18n['runmgmt.app_content.column.enabled']
                    : i18n['runmgmt.app_content.column.disabled']}
                </Td>
                <Td>
                  {!item.enable ? (
                    <Button
                      type="primary"
                      size="small"
                      onClick={this.toggleEnableConfirm.bind(this, item)}
                    >
                      {i18n['runmgmt.app_content.column.mark_enabled']}
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      className={cs['actions-button']}
                      onClick={this.toggleEnableConfirm.bind(this, item)}
                    >
                      {i18n['runmgmt.app_content.column.mark_disabled']}
                    </Button>
                  )}
                  {item.code === 'INFO_ARTICLE' && (
                    <Button
                      size="small"
                      type="primary"
                      className={cs['action-button']}
                      onClick={this.editColumnBanner.bind(this, item)}
                    >
                      {i18n['runmgmt.app_content.column.bannermgmt']}
                    </Button>
                  )}
                  {item.code === 'INFO_ARTICLE' && (
                    <Button
                      size="small"
                      type="primary"
                      className={cs['action-button']}
                      onClick={this.editColumnTitle.bind(this, item)}
                    >
                      {i18n['general.edit']}
                    </Button>
                  )}
                </Td>
              </tr>
            );
          }
          return (
            <DragableBodyRow
              data={item}
              key={index}
              index={index}
              moveRow={this._moveRow}
              toggleEnable={this.toggleEnableConfirm}
              editColumnBanner={this.editColumnBanner}
              editColumnTitle={this.editColumnTitle}
            />
          );
        })}
      </tbody>
    );
  };
  render() {
    const { data } = this.props;
    return (
      <UiTable
        data={data && data}
        columns={COLUMN_COLUMNS}
        renderTbody={this._renderTbody}
        renderHeadCell={this.renderHeadCell}
      />
    );
  }
}

export default class Article extends PureComponent {
  componentDidMount() {
    const { getColumns } = this.props;
    getColumns();
  }
  render() {
    const { data } = this.props;
    return (
      <PagePanel>
        <PagePanel.Header>
          {i18n['runmgmt.app_content.column.title']}
        </PagePanel.Header>
        <PagePanel.Body>
          <DragDropContextProvider backend={HTML5Backend}>
            <DragSortingTable data={data} {...this.props} />
          </DragDropContextProvider>
        </PagePanel.Body>
      </PagePanel>
    );
  }
}
