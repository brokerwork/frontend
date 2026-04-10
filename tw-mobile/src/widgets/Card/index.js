import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { unstable_renderSubtreeIntoContainer, unmountComponentAtNode } from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';
import css from './index.less';

export class Card extends Component {

  static propTypes = {
    show: React.PropTypes.bool,
		title: React.PropTypes.string
  }
  static defaultProps = {
    show: false
  }
  constructor(props) {
    super(props);
    this.overlay = null;
    this.wrapper = null;
  }
	componentDidMount(){
		//console.log('Card componentDidMount')
		this._render();
		setTimeout( this.cancelPreventDefault , 200)
	}

  cancelPreventDefault = () => {
     var ele = document.querySelector("#twCard");
      ele && ele.addEventListener("touchmove", function(e){
        e.stopPropagation()
      })
  }
  componentDidUpdate() {
    //console.log('Card componentDidUpdate')
    this._render();
    
  }
  componentWillUnMount() {
    //console.log('Card willunmount')
    this._purge();
  }
	componentWillReceiveProps(newProps){
		//console.log('Card componentWillReceiveProps')
	}
  _purge = () => {
    if (this.wrapper) {
      this.wrapper.style.top = '100%';
      setTimeout(() => {
        unmountComponentAtNode(this.overlay)
        document.body.removeChild(this.overlay);
				this.overlay = this.wrapper = null;
      }, 200)
    }
  }
  _render() {
    let { show } = this.props;
    let elementToRender = this._renderComponents();
    if (show) {
      if (!this.overlay) {
        this.overlay = document.createElement('div');
        document.body.appendChild(this.overlay);
        this.overlay.className = css['tw-mobile-modal-overlay'];
      }
      this.wrapper = unstable_renderSubtreeIntoContainer(this, elementToRender, this.overlay)
      setTimeout(() => {
        this.wrapper.style.top = 0;
      }, 200)
    } else {
      this._purge();
    }
  }
  _renderFooterActions = () => {
    let { actions } = this.props;
    if (actions == null || actions.length == 0) {
      return null;
    }
    return actions.map((item, index) => {
      return React.cloneElement(item, { key: index })
    })
  }
  _renderComponents() {
    return (
      <div className={css["tw-mobile-modal-body"]} id="twCard">
        <div className={css["tw-mobile-modal-head"]}>
          <span className={css["title"]}>{this.props.title}</span>
        </div>
        <div className={css["tw-mobile-modal-content"]}>{this.props.children}</div>
        <div className={css["tw-mobile-modal-footer"]}>{this._renderFooterActions()}</div>
      </div>
    )
  }
  render() {
    return null
  }
}