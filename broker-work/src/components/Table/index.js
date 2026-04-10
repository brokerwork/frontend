import cs from './Table.less';
import Sortable from 'sortablejs';
class Table extends PureComponent {
  render() {
    const {
      children,
      className = '',
      bsTableStyle = 'table-striped',
      hover = true
    } = this.props;
    return (
      <table
        className={`table ${hover ? 'table-hover' : ''} ${bsTableStyle} ${
          cs['table']
        } ${className}`}
      >
        {children}
      </table>
    );
  }
}

class Header extends PureComponent {
  state = {
    fixeded: false,
    scrollTop: 0
  };

  pageContent = null;
  pageContentOffestTop = 0;

  componentDidMount() {
    const { fixed } = this.props;

    if (fixed) {
      const pageContent = document.getElementById('page-content');
      const pageContentOffestTop = pageContent.getBoundingClientRect().top;

      this.pageContentOffestTop = pageContentOffestTop;
      this.pageContent = pageContent;

      this.pageContent.addEventListener('scroll', this.onScroll, false);
    }
  }

  componentWillUnmount() {
    const { fixed } = this.props;

    if (fixed) {
      this.pageContent.removeEventListener('scroll', this.onScroll, false);
    }
  }

  onScroll = evt => {
    const offestTop = this.refs['header'].getBoundingClientRect().top;
    const scrollTop =
      offestTop - this.state.scrollTop - this.pageContentOffestTop;

    this.setState({
      fixeded: scrollTop < 0,
      scrollTop: scrollTop < 0 ? Math.abs(scrollTop) : 0
    });
  };

  render() {
    const { className = '', children } = this.props;
    const { scrollTop, fixeded } = this.state;
    const style = {
      transform: `translateY(${scrollTop}px)`
    };

    return (
      <thead
        className={`${className} ${cs['header']} ${fixeded ? cs['fixed'] : ''}`}
      >
        <tr style={fixeded ? style : {}} ref="header">
          {children}
        </tr>
      </thead>
    );
  }
}
Table.Header = Header;

class FixedCell extends PureComponent {
  state = {
    fixeded: false,
    scrollLeft: 0
  };

  pageContent = null;
  pageContentOffestLeft = 0;

  componentDidMount() {
    const pageContent = document.getElementById('page-content');
    const pageContentOffestLeft = pageContent.getBoundingClientRect().left;

    this.pageContentOffestLeft = pageContentOffestLeft;
    this.pageContent = pageContent;

    this.pageContent.addEventListener('scroll', this.onScroll, false);
  }

  componentWillUnmount() {
    this.pageContent.removeEventListener('scroll', this.onScroll, false);
  }

  onScroll = evt => {
    const offestLeft = this.refs['cell'].getBoundingClientRect().left;
    const scrollLeft =
      offestLeft - this.state.scrollLeft - this.pageContentOffestLeft;
    const _fixeded = scrollLeft < 0;
    const _scrollLeft = scrollLeft < 0 ? Math.abs(scrollLeft) : 0;
    this.setState({
      fixeded: _fixeded,
      scrollLeft: _scrollLeft
    });
  };

  render() {
    const { className, children, tag = 'td', ...props } = this.props;
    const { scrollLeft, fixeded } = this.state;
    const style = {
      transform: `translateX(${scrollLeft}px)`
    };
    if (tag === 'th') {
      return (
        <th
          {...props}
          className={`${cs['cell']} ${className} ${
            fixeded ? cs['cell-fixed'] : ''
          }`}
          style={fixeded ? style : {}}
          ref="cell"
        >
          {children}
        </th>
      );
    } else {
      return (
        <td
          {...props}
          className={`${cs['cell']} ${className} ${
            fixeded ? cs['cell-fixed'] : ''
          }`}
          style={fixeded ? style : {}}
          ref="cell"
        >
          {children}
        </td>
      );
    }
  }
}

Table.FixedCell = FixedCell;

class Body extends PureComponent {
  componentDidMount() {
    const { sortable, onSort, sortConf = {} } = this.props;
    if (sortable) {
      const options = {
        ...sortConf,
        draggable: 'tr',
        onSort
      };
      Sortable.create(this.refs.sortable, options);
    }
  }

  render() {
    const { children, className = '' } = this.props;
    return (
      <tbody className={`${className} ${cs['body']}`} ref="sortable">
        {children}
      </tbody>
    );
  }
}

// 可排序的tbody
Table.Body = Body;

class SortBody extends Component {
  sortInstance = null;
  componentDidMount() {
    const { sortable, onSort, sortConf = {} } = this.props;
    if (sortable) {
      const options = {
        ...sortConf,
        draggable: 'tr',
        onSort
      };
      Sortable.create(this.refs.sortable, options);
    }
  }

  // componentWillUnmount(){
  //   console.info('---------DESTROY---------',this.sortInstance)
  //   this.sortInstance.destroy();
  // }

  render() {
    const { children, className = '' } = this.props;
    return (
      <tbody className={`${className} ${cs['body']}`} ref="sortable">
        {children}
      </tbody>
    );
  }
}

// 可排序的tbody
Table.SortBody = SortBody;

export default Table;
// SortableJS Configurations
// {
// 	group: "name",  // or { name: "...", pull: [true, false, clone], put: [true, false, array] }
// 	sort: true,  // sorting inside list
// 	delay: 0, // time in milliseconds to define when the sorting should start
// 	disabled: false, // Disables the sortable if set to true.
// 	store: null,  // @see Store
// 	animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
// 	handle: ".my-handle",  // Drag handle selector within list items
// 	filter: ".ignore-elements",  // Selectors that do not lead to dragging (String or Function)
// 	preventOnFilter: true, // Call `event.preventDefault()` when triggered `filter`
// 	draggable: ".item",  // Specifies which items inside the element should be draggable
// 	ghostClass: "sortable-ghost",  // Class name for the drop placeholder
// 	chosenClass: "sortable-chosen",  // Class name for the chosen item
// 	dragClass: "sortable-drag",  // Class name for the dragging item
// 	dataIdAttr: 'data-id',

// 	forceFallback: false,  // ignore the HTML5 DnD behaviour and force the fallback to kick in

// 	fallbackClass: "sortable-fallback",  // Class name for the cloned DOM Element when using forceFallback
// 	fallbackOnBody: false,  // Appends the cloned DOM Element into the Document's Body
// 	fallbackTolerance: 0, // Specify in pixels how far the mouse should move before it's considered as a drag.

// 	scroll: true, // or HTMLElement
// 	scrollFn: function(offsetX, offsetY, originalEvent) { ... }, // if you have custom scrollbar scrollFn may be used for autoscrolling
// 	scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
// 	scrollSpeed: 10, // px

// 	setData: function (/** DataTransfer */dataTransfer, /** HTMLElement*/dragEl) {
// 		dataTransfer.setData('Text', dragEl.textContent); // `dataTransfer` object of HTML5 DragEvent
// 	},

// 	// Element is chosen
// 	onChoose: function (/**Event*/evt) {
// 		evt.oldIndex;  // element index within parent
// 	},

// 	// Element dragging started
// 	onStart: function (/**Event*/evt) {
// 		evt.oldIndex;  // element index within parent
// 	},

// 	// Element dragging ended
// 	onEnd: function (/**Event*/evt) {
// 		var itemEl = evt.item;  // dragged HTMLElement
// 		evt.to;    // target list
// 		evt.from;  // previous list
// 		evt.oldIndex;  // element's old index within old parent
// 		evt.newIndex;  // element's new index within new parent
// 	},

// 	// Element is dropped into the list from another list
// 	onAdd: function (/**Event*/evt) {
// 		// same properties as onEnd
// 	},

// 	// Changed sorting within list
// 	onUpdate: function (/**Event*/evt) {
// 		// same properties as onEnd
// 	},

// 	// Called by any change to the list (add / update / remove)
// 	onSort: function (/**Event*/evt) {
// 		// same properties as onEnd
// 	},

// 	// Element is removed from the list into another list
// 	onRemove: function (/**Event*/evt) {
// 		// same properties as onEnd
// 	},

// 	// Attempt to drag a filtered element
// 	onFilter: function (/**Event*/evt) {
// 		var itemEl = evt.item;  // HTMLElement receiving the `mousedown|tapstart` event.
// 	},

// 	// Event when you move an item in the list or between lists
// 	onMove: function (/**Event*/evt, /**Event*/originalEvent) {
// 		// Example: http://jsbin.com/tuyafe/1/edit?js,output
// 		evt.dragged; // dragged HTMLElement
// 		evt.draggedRect; // TextRectangle {left, top, right и bottom}
// 		evt.related; // HTMLElement on which have guided
// 		evt.relatedRect; // TextRectangle
// 		originalEvent.clientY; // mouse position
// 		// return false; — for cancel
// 	},

// 	// Called when creating a clone of element
// 	onClone: function (/**Event*/evt) {
// 		var origEl = evt.item;
// 		var cloneEl = evt.clone;
// 	}
// }
