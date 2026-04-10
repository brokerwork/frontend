import cs from './TimeLine.less';
import cls from 'utils/class';
import moment from 'moment';
import transferFun from './transfer';
import i18n from 'utils/i18n';
/*
 * 示例: <TimeLine data={data} />
 *
 * props data 必须传入下面的格式:
 *   data:
 *     {
 *       "昨天": [
 *         {
 *           "time": 1483597385193,
 *           "content": "Trader Work 创建了任务",
 *           "user": "徐天翔测试（勿删）",
 *         },
 *         {
 *           "time": 1483611929552,
 *           "content": "认领了任务",
 *           "user": "徐天翔测试（勿删）",
 *         },
 *         {
 *           "time": 1483612393613,
 *           "content": "修改了以下信息:杠杆 MT组 ",
 *           "user": "徐天翔测试（勿删）",
 *         },
 *         {
 *           "time": 1483612516835,
 *           "content": "指派了任务给：暗夜猎手",
 *           "user": "徐天翔测试（勿删）",
 *         }
 *       ]
 *     }
 *
 */

function defaultFormat(v) {
  return v;
}

function defaultTimeFormat(time) {
  return moment(time).format('YYYY.MM.DD HH:mm');
}

function flatArray(data) {
  if (Array.isArray(data)) return data;
  const keys = Object.keys(data);
  const arr = [];
  keys.forEach(k => {
    const item = data[k];
    if (Array.isArray(item)) Array.prototype.push.apply(arr, item);
  });
  return arr;
}

const type1Content = (v, format, timeFormat) => {
  return (
    <div>
      {v.time && <div className={cs['time']}>{timeFormat(v.time)}</div>}
      <div className={cs['content']}>
        {v.user ? `${v.user}: ` : ''}
        {v.content ? format(v.content) : undefined}
      </div>
    </div>
  );
};
const type2Content = (v, format, timeFormat) => {
  return (
    <div>
      <div className={cs['info']}>
        {v.user && <div className={cs['title']}>{v.user}</div>}
        {v.time && <div className={cs['time']}>{timeFormat(v.time)}</div>}
      </div>
      <div className={cs['content']}>
        {v.content ? format(v.content) : undefined}
      </div>
    </div>
  );
};

export default ({
  data,
  format = defaultFormat,
  formatItem = defaultFormat,
  timeFormat = defaultTimeFormat,
  className = '',
  loadMore,
  type = '1',
  hasMore,
  box
}) => {
  const d = flatArray(data);
  return (
    <div
      className={`${className} ${box ? `${cs['box-style']}` : ''} ${
        cs['container']
      }`}
    >
      {d.map((v, index) => {
        let content;
        if (type === '1') {
          content = type1Content(v, format, timeFormat);
        } else if (type === '2') {
          content = type2Content(v, format, timeFormat);
        }
        return (
          <ListWraper key={index} className={cs['message']}>
            <div className={cs.lineBox}>
              <span className={`${cs.dot} main-color-border`} />
              <span className={cs.line} />
            </div>
            <div className={cs['message-detail']}>{formatItem(content, v)}</div>
          </ListWraper>
        );
      })}
      {loadMore &&
        hasMore && (
          <ListWraper key={'loadmore'} className={cs['message']}>
            <div className={cs.lineBox}>
              <span className={`${cs.dot} main-color-border`} />
              <span className={cs.line} />
            </div>
            <div
              className={`${cs['message-detail']} ${
                cs['message-load-more']
              } main-color`}
            >
              <a href="javascript:;" onClick={loadMore}>
                {i18n['timeline.load_more']}
              </a>
            </div>
          </ListWraper>
        )}
    </div>
  );
};

class ListWraper extends PureComponent {
  render() {
    const { children, className = '', timeTag, timeTagClass = '' } = this.props;
    return (
      <div className={cls`${cs['list-wraper']} ${className}`}>
        {timeTag ? (
          <span className={`${cs['timeTag']} ${timeTagClass}`}>{children}</span>
        ) : (
          children
        )}
      </div>
    );
  }
}

export const transfer = transferFun;
