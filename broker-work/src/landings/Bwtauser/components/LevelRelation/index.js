import Table from 'rc-table';
import i18n from 'utils/i18n';
import cs from './index.less';
import 'rc-table/assets/index.css';
import qs from 'utils/queryString';
import _ from 'lodash';
const fakeData = {
  userTree: [
    { id: 1, name: 'rick1', parent: 0 },
    { id: 2, name: 'rick2', parent: 1 },
    { id: 3, name: 'rick3', parent: 2 },
    { id: 4, name: 'rick4', parent: 3 },
    { id: 5, name: 'rick5', parent: 4 },
    { id: 6, name: 'rick6', parent: 4 }
  ],
  accountInfos: [
    {
      login: '2110000150',
      name: 'junliang',
      userId: 5
    },
    {
      login: '45222',
      name: 'junliang2',
      userId: 6
    }
  ]
};
export default class LevelRelation extends PureComponent {
  componentDidMount() {
    const {
      location: { search },
      getLevelRelationList
    } = this.props;
    const query = qs(search);
    getLevelRelationList(
      query.get('account'),
      query.get('serverId'),
      query.get('vendor')
    );
  }
  configColumns = () => {
    const {
      location: { search }
    } = this.props;
    const query = qs(search);
    return [
      {
        title: i18n['tausermgmt.list.level_relation.table_header.name'],
        key: 'name',
        dataIndex: 'name',
        render: (value, row, index) => {
          return (
            <span
              className={
                row.login === query.get('account') && cs['color_choose']
              }
            >
              {value}
            </span>
          );
        }
      },
      {
        title: i18n['tausermgmt.list.level_relation.table_header.type'],
        key: 'type',
        dataIndex: 'type',
        render: (value, row, index) => {
          return (
            <span
              className={
                row.login === query.get('account') && cs['color_choose']
              }
            >
              {value}
            </span>
          );
        }
      },
      {
        title: i18n['tausermgmt.list.level_relation.table_header.id'],
        key: 'entityNo',
        dataIndex: 'entityNo',
        render: (value, row, index) => {
          return (
            <span
              className={
                row.login === query.get('account') && cs['color_choose']
              }
            >
              {value || '--'}
            </span>
          );
        }
      },
      {
        title: i18n['tausermgmt.list.level_relation.table_header.levelName'],
        key: 'levelName',
        dataIndex: 'levelName',
        className: cs['level-name'],
        render: (value, row, index) => {
          return (
            <span
              className={
                `${row.login === query.get('account') && cs['color_choose']}`
              }
              title={value}
            >
              {value || '--'}
            </span>
          );
        }
      },
      {
        title: i18n['tausermgmt.list.level_relation.table_header.login'],
        key: 'login',
        dataIndex: 'login',
        render: (value, row, index) => {
          return (
            <span
              className={
                row.login === query.get('account') && cs['color_choose']
              }
            >
              {!row.entityNo ? value : '--'}
            </span>
          );
        }
      }
    ];
  };
  onExpand = (expanded, record) => {
    console.log('onExpand', expanded, record);
  };
  configFunction = (list, item, flag) => {
    list.length &&
      list.forEach(b => {
        if (b.children) {
          const itemb =
            b.children.length && b.children.find(bb => bb.id == item.parent);
          if (itemb) {
            if (!itemb.children) {
              itemb.children = [];
            }
            itemb.children.push(item);
            flag.status = true;
          } else {
            //递归
            this.configFunction(b.children, item, flag);
          }
        } else {
          // 无需操作
        }
      });
  };
  configData = () => {
    const { levelRelationLists } = this.props;
    const userTree = _.cloneDeep(levelRelationLists.userTree);
    const accountInfos = _.cloneDeep(levelRelationLists.accountInfos);
    // const { userTree, accountInfos } = _.cloneDeep(fakeData);
    let resetList = [];
    let flag = { status: false };
    userTree &&
      userTree.forEach(user => {
        // 处理accountInfo
        accountInfos &&
          accountInfos.length &&
          accountInfos.forEach(account => {
            // account.id = account.login;
            account.key = account.login;
            account.type =
              i18n['tausermgmt.list.level_relation.table.account_type'];
            if (user.id == account.userId) {
              if (!user.children) {
                user.children = [];
              }
              user.children.push(account);
            }
          });
        flag.status = false;
        // 加上key antd表格展开需要
        user.key = user.id;
        user.type = i18n['tausermgmt.list.level_relation.table.user_type'];
        let item =
          resetList &&
          resetList.length &&
          resetList.find(a => {
            return a.id == user.parent;
          });
        if (item) {
          if (!item.children) {
            item.children = [];
          }
          item.children.push(user);
          flag.status = true;
        } else {
          this.configFunction(resetList, user, flag);
        }
        if (!flag.status) {
          resetList.push(user);
        }
      });
    return resetList;
  };
  render() {
    const columns = this.configColumns();
    const data = this.configData();
    return (
      <div>
        {data && data.length ? (
          <Table
            defaultExpandAllRows
            className={cs.table_container}
            columns={columns}
            data={data}
            onExpand={this.onExpand}
          />
        ) : (
          <div className={cs['no-item']}>
            <i className="fa fa-folder" />
            <p>{i18n['general.no_data']}</p>
          </div>
        )}
      </div>
    );
  }
}
