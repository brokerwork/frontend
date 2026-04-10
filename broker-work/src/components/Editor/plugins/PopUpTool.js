import { findDOMNode } from 'react-dom';
import DefaultTool from './DefaultTool';
import cs from '../Editor.less';

export default class PopUpTool extends DefaultTool {
  state = {
    show: false
  };

  togglePop = toggle => {
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    let _toggle = toggle;
    if (typeof toggle === 'undefined') {
      const { show } = this.state;
      _toggle = !show;
    }
    this.setState({
      show: _toggle
    });
  };

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false);
  }

  handleDocumentClick = evt => {
    if (!findDOMNode(this).contains(evt.target)) {
      this.setState({
        show: false
      });
    }
  };
}
