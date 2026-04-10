// 用于除header footer部分 页面内部大小固定
// 在设计上由于经常使用这种方式, 所以提取出来

import cs from './FixedPageContent.less';
import cls from 'utils/class';
export default class FixedPageContent extends PureComponent {
  componentDidMount() {
    this.setContentHeight();
    window.addEventListener('resize', this.setContentHeight, false);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.setContentHeight, false);
  }
  setContentHeight = () => {
    const content = document.querySelector('#fixed-page-content');
    const offsetHeight = document.documentElement.clientHeight - 148;
    content.style.height = `${offsetHeight}px`;
  };
  render() {
    const {
      children,
      className = '',
      scrollAdaptive = false,
      header = false,
      footer = false
    } = this.props;
    return (
      <div
        id="fixed-page-content"
        className={cls`${cs['fixed-page-content']}
        ${className}
      `}
      >
        {children}
      </div>
    );
  }
}

FixedPageContent.Header = ({
  children,
  className = '',
  scrollAdaptive = false
}) => (
  <div
    className={cls`${cs['fixed-page-header']}
    ${className}
    ${scrollAdaptive ? pageXOffsetStyle : ''}
  `}
  >
    {children}
  </div>
);

FixedPageContent.Footer = ({
  children,
  className = '',
  scrollAdaptive = false
}) => (
  <div
    className={cls`${cs['fixed-page-footer']}
    ${className}
    ${scrollAdaptive ? pageXOffsetStyle : ''}
  `}
  >
    {children}
  </div>
);
