import { findDOMNode } from 'react-dom';
import cs from './Tips.less';

export default class Tips extends PureComponent {
  state = {
    show: false
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

  toggle = () => {
    this.setState({
      show: !this.state.show
    });
  };

  render() {
    const { show } = this.state;
    const { children, align = 'left', className = '' } = this.props;
    return (
      <div className={`${cs['tips']} ${cs[`tips-${align}`]} ${className}`}>
        <span className={`fa fa-question-circle-o tips-toggle ${cs['tips-toggle']}`} onClick={this.toggle} />
        {show ? (
          <div className={cs['tips-content']}>
            <div className={cs['arrow']} />
            {children}
          </div>
        ) : (
          undefined
        )}
      </div>
    );
  }
}
