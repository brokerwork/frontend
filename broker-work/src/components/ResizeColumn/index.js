import cs from './resize.less';
import { findDOMNode } from 'react-dom';
class Container extends Component {
  render() {
    const { children, className } = this.props;
    return (
      <div className={`${cs['container']} ${className}`} ref="container">
        {children}
      </div>
    );
  }
}

class Column extends Component {
  state = {
    pageX: undefined,
    resizable: false,
    width: undefined
  };
  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove, false);
    document.addEventListener('mouseup', this.onMouseUp, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove, false);
    document.removeEventListener('mouseup', this.onMouseUp, false);
  }
  onMouseDown = event => {
    const dom = this.refs.column;
    const width = parseFloat(dom.offsetWidth) || undefined;
    if (typeof width !== 'undefined') {
      this.setState({
        width
      });
    }
    this.setState({
      pageX: event.pageX,
      resizable: true
    });
  };
  onMouseMove = event => {
    const { min = 0, max } = this.props;
    let { pageX, resizable, width } = this.state;
    if (!resizable || typeof width === 'undefined') return;
    const distance = pageX - event.pageX;
    width -= distance;
    if (width < min || (max && width > max)) {
      return;
    }
    this.setState({
      width,
      pageX: event.pageX
    });
    const selection = window.getSelection();
    selection.removeAllRanges();
  };
  onMouseUp = event => {
    this.setState({
      resizable: false
    });
  };
  render() {
    const { children, className } = this.props;
    const { width } = this.state;
    const style = {
      width: `${width}px`
    };
    return (
      <div
        className={`${cs['column']} ${className}`}
        ref="column"
        style={style}
      >
        {children}
        <div onMouseDown={this.onMouseDown} className={cs['resize-cursor']} />
      </div>
    );
  }
}

export default {
  Container,
  Column
};
