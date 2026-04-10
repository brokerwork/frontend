import { shallow } from 'enzyme';
import Chart from '../index.js';

const transferFunnel = {
  detail: {
    all: {
      CREATE: 178,
      OPEN_ACCOUNT: 151,
      DEAL: 8,
      DEPOSIT: 65
    },
    '04Y25145': {
      CREATE: 12,
      OPEN_ACCOUNT: 1,
      DEAL: 0,
      DEPOSIT: 0
    }
  },
  trend: {
    all: {
      CREATE: [
        {
          key: '1514160000',
          value: 4
        },
        {
          key: '1513641600',
          value: 6
        },
        {
          key: '1513728000',
          value: 21
        },
        {
          key: '1513814400',
          value: 51
        },
        {
          key: '1513900800',
          value: 72
        },
        {
          key: '1513987200',
          value: 24
        },
        {
          key: '1514246400',
          value: 0
        },
        {
          key: '1514073600',
          value: 0
        }
      ],
      OPEN_ACCOUNT: [
        {
          key: '1514160000',
          value: 4
        },
        {
          key: '1513641600',
          value: 1
        },
        {
          key: '1513728000',
          value: 9
        },
        {
          key: '1513814400',
          value: 46
        },
        {
          key: '1513900800',
          value: 71
        },
        {
          key: '1513987200',
          value: 20
        },
        {
          key: '1514246400',
          value: 0
        },
        {
          key: '1514073600',
          value: 0
        }
      ],
      DEAL: [
        {
          key: '1513728000',
          value: 2
        },
        {
          key: '1513987200',
          value: 6
        },
        {
          key: '1514160000',
          value: 0
        },
        {
          key: '1514246400',
          value: 0
        },
        {
          key: '1513641600',
          value: 0
        },
        {
          key: '1513814400',
          value: 0
        },
        {
          key: '1513900800',
          value: 0
        },
        {
          key: '1514073600',
          value: 0
        }
      ],
      DEPOSIT: [
        {
          key: '1514160000',
          value: 2
        },
        {
          key: '1513728000',
          value: 4
        },
        {
          key: '1513814400',
          value: 8
        },
        {
          key: '1513900800',
          value: 37
        },
        {
          key: '1513987200',
          value: 14
        },
        {
          key: '1514246400',
          value: 0
        },
        {
          key: '1513641600',
          value: 0
        },
        {
          key: '1514073600',
          value: 0
        }
      ]
    },
    '04Y25145': {
      CREATE: [
        {
          key: '1513641600',
          value: 1
        },
        {
          key: '1513728000',
          value: 11
        },
        {
          key: '1514160000',
          value: 0
        },
        {
          key: '1514246400',
          value: 0
        },
        {
          key: '1513814400',
          value: 0
        },
        {
          key: '1513900800',
          value: 0
        },
        {
          key: '1513987200',
          value: 0
        },
        {
          key: '1514073600',
          value: 0
        }
      ],
      OPEN_ACCOUNT: [
        {
          key: '1513728000',
          value: 1
        },
        {
          key: '1514160000',
          value: 0
        },
        {
          key: '1514246400',
          value: 0
        },
        {
          key: '1513641600',
          value: 0
        },
        {
          key: '1513814400',
          value: 0
        },
        {
          key: '1513900800',
          value: 0
        },
        {
          key: '1513987200',
          value: 0
        },
        {
          key: '1514073600',
          value: 0
        }
      ],
      DEAL: [
        {
          key: '1514160000',
          value: 0
        },
        {
          key: '1514246400',
          value: 0
        },
        {
          key: '1513641600',
          value: 0
        },
        {
          key: '1513728000',
          value: 0
        },
        {
          key: '1513814400',
          value: 0
        },
        {
          key: '1513900800',
          value: 0
        },
        {
          key: '1513987200',
          value: 0
        },
        {
          key: '1514073600',
          value: 0
        }
      ],
      DEPOSIT: [
        {
          key: '1514160000',
          value: 0
        },
        {
          key: '1514246400',
          value: 0
        },
        {
          key: '1513641600',
          value: 0
        },
        {
          key: '1513728000',
          value: 0
        },
        {
          key: '1513814400',
          value: 0
        },
        {
          key: '1513900800',
          value: 0
        },
        {
          key: '1513987200',
          value: 0
        },
        {
          key: '1514073600',
          value: 0
        }
      ]
    }
  }
};

describe('来源转换漏斗 Chart', () => {
  const wrap = shallow(
    <Chart
      data={transferFunnel}
      activeSource={'all'}
      defaultSource={{ value: 'all', label: '全部来源' }}
    />
  );
  describe('显示', () => {
    it('数据正常', () => {
      setTimeout(() => {
        expect(wrap.instance().props.data['all']).toBe('178');
      });
    });
  });
});
