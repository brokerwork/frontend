import Table from 'rc-table';
import 'rc-table/assets/index.css';
import cs from './index.less';
// import { injectGlobal } from 'styled-components';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

// injectGlobal`
//   tr.drop-over-downward td {
//     border-bottom: 2px dashed red;
//   }

//   tr.drop-over-upward td {
//     border-top: 2px dashed red;
//   }
// `;

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

class BodyRow extends Component {
  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      dragRow,
      clientOffset,
      sourceClientOffset,
      initialClientOffset,
      ...restProps
    } = this.props;
    const style = { cursor: 'move' };

    let className = restProps.className;
    if (isOver && initialClientOffset) {
      const direction = dragDirection(
        dragRow.index,
        restProps.index,
        initialClientOffset,
        clientOffset,
        sourceClientOffset
      );
      if (direction === 'downward') {
        className += ' drop-over-downward';
      }
      if (direction === 'upward') {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(
        <tr {...restProps} className={className} style={style} />
      )
    );
  }
}
let editingItem = null;
let data = [];
const rowSource = {
  beginDrag(props) {
    return {
      index: props.index
    };
  },
  canDrag(props) {
    const { index } = props;
    if (editingItem) {
      if (data && data.length) {
        return data[index].id !== editingItem.id;
      }
    } else {
      return true;
    }
    return true;
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

class newTable extends React.Component {
  constructor(props) {
    super(props);
  }
  component = {
    body: {
      row: DragableBodyRow
    }
  };
  render() {
    editingItem = this.props.editingItem;
    data = this.props.data;
    return (
      <div>
        <Table
          className={cs.table_container}
          {...this.props}
          components={this.component}
          onRow={(record, index) => ({
            index,
            moveRow: this.props.moveRow,
            className: `customize-class-${index} ${this.props.rowClass}`
          })}
        />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(newTable);
