import moment from 'moment';
import { FILTER_TYPES } from '../contants';

export const formatDateRangeByTimeUnit = ({ startDate, endDate }, timeUnit) => {
  return {
    startDate: moment(startDate)
      .startOf(timeUnit)
      .valueOf(),
    endDate: moment(endDate)
      .endOf(timeUnit)
      .valueOf()
  };
};

/* formatTimeLine生成数据格式
{
  header: [
    {
      count: 1,
      value: [
        {
          timestamp: 1506787200000,
          year: '2017',
          index: '4',
          key: '2017-4',
          type: 'quarter'
        }
      ],
      year: '2017'
    },
    {
      count: 1,
      value: [
        {
          timestamp: 1514736000000,
          year: '2018',
          index: '1',
          key: '2018-1',
          type: 'quarter'
        }
      ],
      year: '2018'
    }
  ],
  list: [
    {
      timestamp: 1506787200000,
      year: '2017',
      index: '4',
      key: '2017-4',
      type: 'quarter'
    },
    {
      timestamp: 1514736000000,
      year: '2018',
      index: '1',
      key: '2018-1',
      type: 'quarter'
    }
  ],
  type: 'quarter'
}; */

export const formatTimeLine = (startDate, endDate, timeUnit) => {
  const timeLine = {
    header: [],
    list: [],
    type: timeUnit
  };
  const timeUnitFormatKeyMap = {
    month: 'MM',
    quarter: 'Q'
  };
  if (startDate > endDate) return timeLine; //排除死循环情况
  let tempTime = startDate;
  let safeThreshold = 0;
  const a = moment;
  while (tempTime <= endDate && safeThreshold < 1000) {
    const tempYearEnd = moment(tempTime).endOf('year');
    const yearStr = moment(tempTime).format('YYYY');
    const tempYearArray = [];
    let yearIndex = 1;
    while (
      tempTime <= tempYearEnd &&
      tempTime <= endDate &&
      safeThreshold < 1000
    ) {
      const indexStr =
        timeUnit === 'year'
          ? ''
          : moment(tempTime).format(timeUnitFormatKeyMap[timeUnit]);
      const content = {
        timestamp: tempTime,
        year: yearStr,
        index: indexStr,
        key: timeUnit === 'year' ? yearStr : `${yearStr}-${indexStr}`,
        type: timeUnit
      };
      tempYearArray.push(content);
      tempTime = moment(tempTime)
        .add(1, timeUnit)
        .valueOf();
      safeThreshold++;
      yearIndex++;
    }
    timeLine.header.push({
      count: tempYearArray.length,
      value: tempYearArray,
      year: yearStr
    });
    timeLine.list = timeLine.list.concat(tempYearArray);
  }
  return timeLine;
};

export const getParsedSearchTypes = userRight => {
  let hasAll = false;
  let allItem;
  const parsed = FILTER_TYPES.concat().filter(item => {
    if (!item.right) return true;
    if (!allItem && item.value === 'all') allItem = item;
    if (!hasAll && userRight[item.right] && item.value === 'all') hasAll = true;
    return userRight[item.right];
  });
  if (parsed.length > 1 && !hasAll) {
    const _allType = FILTER_TYPES.concat().find(item => item.value === 'all');
    parsed.unshift(_allType);
  }
  return parsed;
};
