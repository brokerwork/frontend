import cs from './TimeLine.less';
import cls from 'utils/class';
import moment from 'moment';
import transferFun from './transfer';
import { todayKey } from './transfer';
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
 *           "icon": "fa fa-plus",
 *           "extras": {}
 *         },
 *         {
 *           "time": 1483611929552,
 *           "content": "认领了任务",
 *           "user": "徐天翔测试（勿删）",
 *           "icon": "fa fa-arrow-up",
 *           "extras": {}
 *         },
 *         {
 *           "time": 1483612393613,
 *           "content": "修改了以下信息:杠杆 MT组 ",
 *           "user": "徐天翔测试（勿删）",
 *           "icon": "fa fa-pencil",
 *           "extras": {}
 *         },
 *         {
 *           "time": 1483612516835,
 *           "content": "指派了任务给：暗夜猎手",
 *           "user": "徐天翔测试（勿删）",
 *           "icon": "fa fa-arrow-up",
 *           "extras": {}
 *         }
 *       ]
 *     }
 *
 */

function defaultFormat(v) {
  return v;
}

export default ({
  data,
  format = defaultFormat,
  formatItem = defaultFormat,
  className = '',
  loadMore,
  hasMore,
  box
}) => {
  const dataKeys = Object.keys(data);
  return (
    <div
      className={`${className} ${box ? cs['box-style'] : ''} ${
        cs['container']
      }`}
    >
      {dataKeys.map((key, i) => {
        const item = data[key];
        const isToday = key === todayKey;
        return (
          <div
            key={i}
            className={`${cs['time-block']} ${
              !isToday ? cs['time-ignore'] : ''
            }`}
          >
            <ListWraper timeTag className={`${i === 0 ? cs['first'] : ''}`}>
              <i className={`${cs['timeTag-icon']}`} />
              <span className={cs['timeTag-text']}>{key}</span>
            </ListWraper>
            {item.map((v, index) => {
              const content = (
                <span>
                  {v.time ? (
                    <span className={cs['time']}>
                      {moment(v.time).format('HH:mm')}
                    </span>
                  ) : (
                    undefined
                  )}
                  <span className={cs['user']}>
                    {i18n['settings.link_setting.creator']}： {v.user}
                  </span>
                  <div className={cs['content']}>
                    {v.content ? format(v.content) : undefined}
                  </div>
                </span>
              );
              return (
                <ListWraper key={index} className={cs['message']}>
                  <div>
                    <i className={`${v.icon} ${cs['content-type']}`} />
                  </div>
                  <div className={cs['message-detail']}>
                    {formatItem(content, v, dataKeys, i)}
                  </div>
                </ListWraper>
              );
            })}
            {loadMore && hasMore && i === dataKeys.length - 1 ? (
              <ListWraper key={'loadmore'} className={cs['message']}>
                <div>
                  <i className={`fa fa-ellipsis-h ${cs['content-type']}`} />
                </div>
                <div
                  className={`${cs['message-detail']} ${
                    cs['message-load-more']
                  }`}
                >
                  <a href="javascript:;" onClick={loadMore}>
                    {i18n['timeline.load_more']}
                  </a>
                </div>
              </ListWraper>
            ) : (
              undefined
            )}
          </div>
        );
      })}
    </div>
  );
};

class ListWraper extends PureComponent {
  render() {
    const { children, className = '', timeTag } = this.props;
    return (
      <div className={cls`${cs['list-wraper']} ${className}`}>
        {timeTag ? <span className={cs['timeTag']}>{children}</span> : children}
      </div>
    );
  }
}

export const transfer = transferFun;
