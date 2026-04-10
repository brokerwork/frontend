import cs from './ColumnSelector.less';
import { findDOMNode } from 'react-dom';
import ResizeColumn from '../ResizeColumn';
import Picker from './picker';
import _ from 'lodash';
// import { Input } from 'lean-ui';

const animationFrame =
  requestAnimationFrame ||
  webkitRequestAnimationFrame ||
  mozRequestAnimationFrame ||
  msRequestAnimationFrame ||
  function(cb) {
    setTimeout(cb, 10);
  };

const locationColumeLi = (() => {
  const fixedClass = cs['fixed-colume-title'];
  const tarClassName = cs['colume-text'];
  const fixedShowColumeInfo =
    document.getElementsByClassName(fixedClass)[0] ||
    document.createElement('div');
  fixedShowColumeInfo.className = fixedClass;
  fixedShowColumeInfo.style.cssText = `
    position: fixed;
    z-index: 9999;
    visibility: hidden;
    padding-right: 5px;
  `;
  document.body.appendChild(fixedShowColumeInfo);

  // 处理fixed层的点击事件同步到模仿元素
  fixedShowColumeInfo.onclick = () => {
    if (currentLi) {
      currentLi.click();
      animationFrame(() => {
        const computedStyle = getComputedStyle(currentLi.firstElementChild);
        fixedShowColumeInfo.style.color = computedStyle.color;
        fixedShowColumeInfo.style.fontWeight = computedStyle.fontWeight;
        fixedShowColumeInfo.style.backgroundColor =
          computedStyle.backgroundColor;
      });
    }
  };

  let currentLi;
  let textSpan;
  let textSpanClone;
  let textSpanRect;
  let textSpanComputedStyle;
  function showFix() {
    fixedShowColumeInfo.style.visibility = 'visible';
  }
  function hideFix() {
    fixedShowColumeInfo.style.visibility = 'hidden';
  }
  // 隐藏浮动窗
  fixedShowColumeInfo.addEventListener('mouseout', hideFix);
  fixedShowColumeInfo.addEventListener('mousewheel', hideFix);
  // 处理hover事件
  function handler(e) {
    if (
      e.target.classList.contains(tarClassName) ||
      (e.target.tagName === 'SPAN' &&
        e.target.parentElement.classList.contains(tarClassName))
    ) {
      const target = e.target;
      textSpan = target.getElementsByTagName('span')[0] || target;
      textSpanClone = textSpan.cloneNode(true);
      fixedShowColumeInfo.innerHTML = textSpanClone.innerHTML;
      textSpanRect = textSpan.getBoundingClientRect();
      textSpanComputedStyle = getComputedStyle(textSpan);
      animationFrame(() => {
        if (fixedShowColumeInfo.clientWidth > textSpanRect.width) {
          // 保持每次都能获取到最新的样式
          fixedShowColumeInfo.style.color = textSpanComputedStyle.color;
          fixedShowColumeInfo.style.fontWeight =
            textSpanComputedStyle.fontWeight;
          fixedShowColumeInfo.style.backgroundColor =
            textSpanComputedStyle.backgroundColor;
          fixedShowColumeInfo.style.top = `${textSpanRect.top}px`;
          fixedShowColumeInfo.style.left = `${textSpanRect.left}px`;
          currentLi = target.parentElement;
          showFix();
        } else {
          hideFix();
        }
      });
    } else if (!e.target.classList.contains(fixedClass)) {
      // 当hover到非列元素或当前fixed元素时，说明鼠标已移开当前查看范围，这是需要隐藏fixed元素；
      hideFix();
    }
  }
  // 移除实践
  return {
    mount() {
      // 当hover时，执行操作
      document.body.addEventListener('mouseover', handler);
    },
    destroy() {
      currentLi = null;
      textSpan = null;
      textSpanClone = null;
      textSpanRect = null;
      textSpanComputedStyle = null;
      document.body.removeEventListener('mouseover', handler);
    }
  };
})();

export default class ColumnSelector extends Component {
  state = {
    selectedItem: this.props.defaultValue || {}
  };
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.selectedItem &&
      JSON.stringify(nextProps.selectedItem) !==
        JSON.stringify(this.state.selectedItem)
    ) {
      this.setState({
        selectedItem: nextProps.selectedItem
      });
    }
  }

  componentWillMount() {
    locationColumeLi.mount();
  }

  componentWillUnmount() {
    locationColumeLi.destroy();
  }

  onSelect = (item, index) => {
    const { selectedItem } = this.state;
    const { onChange, data } = this.props;
    const __obj = {};
    const __data = [];

    for (var i = 0, l = data.length; i < l; i++) {
      if (i > index) break;
      __data.push(data[i]);
      __obj[i] = selectedItem[i];
    }
    __obj[index] = item.value;

    this.setState({
      selectedItem: __obj
    });

    onChange && onChange(item, __data, __obj);
  };
  scrollToRight = () => {
    if (this.__timer__) {
      clearTimeout(this.__timer__);
    }
    this.__timer__ = setTimeout(() => {
      const container = findDOMNode(this.refs['container']);
      container.scrollLeft += container.scrollLeft + 10000;
      this.__timer__ = 0;
    }, 100);
  };
  // 筛选列
  // searchColume = _.debounce((index, e) => {
  //   const { columeSearches = {} } = this.state;
  //   this.setState({
  //     columeSearches: { ...columeSearches, [index]: e.target.value }
  //   });
  // });
  // getColumeSearch = (data, input) => {
  //   return !!input ? data.filter(item => item.label.match(input)) : data;
  // };
  render() {
    const { selectedItem, columeSearches = {} } = this.state;
    const { data, className = '' } = this.props;
    this.scrollToRight();
    return (
      <ResizeColumn.Container
        className={`${cs['container']} ${className}`}
        ref="container"
      >
        {data.map((v, index) => {
          const _list = v; //this.getColumeSearch(v, columeSearches[index]);
          return (
            <ResizeColumn.Column key={index} className={cs['resize-column']}>
              {/* <Input
                suffix={<i className="icon-lw-search" />}
                onInput={this.searchColume.bind(this, index)}
              /> */}
              <ul className={cs['column']}>
                {_list.map((item, i) => {
                  return (
                    <li
                      className={`${
                        selectedItem[index] == item.value
                          ? `${cs['active']} main-color main-color-hover`
                          : ''
                      } ${cs['colume-li']}`}
                      onClick={this.onSelect.bind(this, item, index)}
                      key={i}
                    >
                      <div className={cs['colume-text']}>
                        <span title={item.label}>{item.label}</span>
                      </div>
                      {item.child ? (
                        <i className={`fa fa-angle-right ${cs['icon']}`} />
                      ) : (
                        undefined
                      )}
                    </li>
                  );
                })}
              </ul>
            </ResizeColumn.Column>
          );
        })}
      </ResizeColumn.Container>
    );
  }
}

export const ColumnPicker = Picker;
