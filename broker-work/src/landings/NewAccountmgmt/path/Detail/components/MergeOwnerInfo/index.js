import Modal from 'components/Modal';
import cs from './MergeOwnerInfo.less';
import i18n from 'utils/i18n';
import getCustomFieldValue from 'utils/fieldValue';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Button, Radio, Dialog } from 'lean-ui';

const info = [
  {
    key: 'baseInfo',
    title: i18n['account.merge_account_owner_info.base_info'],
    formName: 'baseInfo'
  },
  {
    key: 'financialInfo',
    title: i18n['account.merge_account_owner_info.financial_info'],
    formName: 'financialInfo'
  },
  {
    key: 'certificatesInfo',
    title: i18n['account.merge_account_owner_info.certificates_info'],
    formName: 'certificatesInfo'
  },
  {
    key: 'classificationInfo',
    title: i18n['account.merge_account_owner_info.classification_Info'],
    formName: 'classificationInfo'
  },
  {
    key: 'appropriatenessTestInfo',
    title: i18n['account.merge_account_owner_info.appropriateness_test_info'],
    formName: 'appropriatenessTestInfo'
  }
];

export default class MergeAccountOwnerInfo extends PureComponent {
  state = {
    selectedFields: {
      baseInfo: [],
      financialInfo: [],
      certificatesInfo: [],
      classificationInfo: [],
      appropriatenessTestInfo: 'new'
    }
  };

  select = (type, field, source) => {
    const { selectedFields } = this.state;
    const copyData = JSON.parse(JSON.stringify(selectedFields));

    if (source === 'old') {
      copyData[type].push(field);
    } else {
      const idx = copyData[type].findIndex(item => item === field);

      copyData[type].splice(idx, 1);
    }

    this.setState({
      selectedFields: copyData
    });
  };

  selectAll = source => {
    const {
      diffOwnerInfo: { diffResult }
    } = this.props;
    const { selectedFields } = this.state;
    const copyData = JSON.parse(JSON.stringify(selectedFields));
    const copyDiffResult = JSON.parse(JSON.stringify(diffResult));

    for (let key in copyData) {
      if (key === 'appropriatenessTestInfo') {
        copyData[key] = source;
      } else {
        if (source === 'old') {
          copyData[key] = copyDiffResult[key].map(item => item.field);
        } else {
          copyData[key] = [];
        }
      }
    }

    this.setState({
      selectedFields: copyData
    });
  };

  selectTest = source => {
    const { selectedFields } = this.state;
    const copyData = JSON.parse(JSON.stringify(selectedFields));

    copyData.appropriatenessTestInfo = source;

    this.setState({
      selectedFields: copyData
    });
  };

  onMerge = () => {
    const { selectedFields } = this.state;
    const {
      accountId,
      selectedCustomer,
      currentServer,
      showTipsModal,
      showTopAlert,
      mergeOwnerInfo,
      onMerge,
      ownerRelatedInfo: { customer }
    } = this.props;
    const customerId = selectedCustomer.value;
    const copyData = JSON.parse(JSON.stringify(selectedFields));

    copyData.appropriatenessTestInfo =
      copyData.appropriatenessTestInfo === 'old' ? customer.value : customerId;

    showTipsModal({
      content: i18n['account.account_customer_binding.tips4'],
      confirmBtnText: i18n['account.account_customer_binding.buttons.merge'],
      onConfirm: cb => {
        mergeOwnerInfo(accountId, customerId, copyData, currentServer).then(
          ({ result }) => {
            if (result) {
              showTopAlert({
                bsStyle: 'success',
                content: i18n['account.account_customer_binding.merge_success']
              });
              if (onMerge) onMerge();
            }
          }
        );
        cb();
      }
    });
  };

  checkWhichSelected = () => {
    const {
      diffOwnerInfo: { diffResult }
    } = this.props;
    const { selectedFields } = this.state;
    const selectedTypes = [];
    const unSelectedTypes = [];
    const keyLength = Object.keys(diffResult).length;

    for (let key in selectedFields) {
      if (key === 'appropriatenessTestInfo') {
        if (selectedFields[key] === 'old') {
          selectedTypes.push(key);
        } else {
          unSelectedTypes.push(key);
        }
      } else {
        if (selectedFields[key].length === diffResult[key].length) {
          selectedTypes.push(key);
        }

        if (!selectedFields[key].length) {
          unSelectedTypes.push(key);
        }
      }
    }

    return {
      oldSelected: selectedTypes.length === keyLength,
      newSelected: unSelectedTypes.length === keyLength
    };
  };

  _renderRow = (type, formName, fields) => {
    const { formColumns } = this.props;
    const { selectedFields } = this.state;
    return fields.map((item, idx) => {
      const { field, value1, value2 } = item;
      const column = formColumns[formName].find(col => col.key === field);
      const label = column.label;
      const selected = selectedFields[type].includes(field);

      console.log('type', column, item);
      return (
        <tr key={idx}>
          <td>
            <i className={`fa fa-exclamation ${cs['icon']}`} />
            {label}
          </td>
          <td>
            <Radio
              name={`${type}_${field}`}
              checked={selected}
              onChange={this.select.bind(this, type, field, 'old')}
            >
              {getCustomFieldValue(column, value1)}
            </Radio>
          </td>
          <td>
            <Radio
              name={`${type}_${field}`}
              checked={!selected}
              onChange={this.select.bind(this, type, field, 'new')}
            >
              {getCustomFieldValue(column, value2)}
            </Radio>
          </td>
        </tr>
      );
    });
  };

  _renderTestRow = fields => {
    const timeField = fields.find(item => item.field === 'time') || {};
    const scoreField = fields.find(item => item.field === 'score') || {};
    const totalScoreField =
      fields.find(item => item.field === 'totalScore') || {};
    const resultField = fields.find(item => item.field === 'result') || {};
    const leverageField = fields.find(item => item.field === 'leverage') || {};
    const { selectedFields } = this.state;
    const selected = selectedFields.appropriatenessTestInfo;

    return (
      <tr key="appropriateness-test">
        <td>
          <i className={`fa fa-exclamation ${cs['icon']}`} />
          {i18n['account.edit_account.tabs.appropriateness']}
        </td>
        <td>
          <Radio
            name="test"
            checked={selected === 'old'}
            onChange={this.selectTest.bind(this, 'old')}
          >
            <ul className={cs['test-info']}>
              <li>
                {i18n['appropriateness.test_time']}：
                {timeField.value1 !== undefined
                  ? moment(timeField.value1).format('YYYY-MM-DD HH:mm')
                  : ''}
              </li>
              <li>
                {i18n['appropriateness.test_score']}：
                {scoreField.value1 !== undefined &&
                totalScoreField.value1 === undefined ? (
                  scoreField.value1
                ) : scoreField.value1 === undefined &&
                totalScoreField.value1 !== undefined ? (
                  <FormattedMessage
                    id="account.detail.test.total_score"
                    defaultMessage={i18n['account.detail.test.total_score']}
                    values={{
                      score: '',
                      totalScore: `${totalScoreField.value1}`
                    }}
                  />
                ) : scoreField.value1 !== undefined &&
                totalScoreField.value1 !== undefined ? (
                  <FormattedMessage
                    id="account.detail.test.total_score"
                    defaultMessage={i18n['account.detail.test.total_score']}
                    values={{
                      score: `${scoreField.value1}`,
                      totalScore: `${totalScoreField.value1}`
                    }}
                  />
                ) : (
                  undefined
                )}
              </li>
              <li>
                {i18n['appropriateness.test_result']}：
                {resultField.value1 !== undefined
                  ? `${
                      i18n[`appropriateness.test_result.${resultField.value1}`]
                    }${
                      leverageField && leverageField.value1 !== undefined
                        ? `, ${i18n['appropriateness.suggest_leverage']} 1 : ${
                            leverageField.value1
                          }`
                        : ''
                    }`
                  : undefined}
              </li>
            </ul>
          </Radio>
        </td>
        <td>
          <Radio
            name="test"
            checked={selected === 'new'}
            onChange={this.selectTest.bind(this, 'new')}
          >
            <ul className={cs['test-info']}>
              <li>
                {i18n['appropriateness.test_time']}：
                {timeField.value2 !== undefined
                  ? moment(timeField.value2).format('YYYY-MM-DD HH:mm')
                  : ''}
              </li>
              <li>
                {i18n['appropriateness.test_score']}：
                {scoreField.value2 !== undefined &&
                totalScoreField.value2 === undefined ? (
                  scoreField.value2
                ) : scoreField.value2 === undefined &&
                totalScoreField.value2 !== undefined ? (
                  <FormattedMessage
                    id="account.detail.test.total_score"
                    defaultMessage={i18n['account.detail.test.total_score']}
                    values={{
                      score: '',
                      totalScore: `${totalScoreField.value2}`
                    }}
                  />
                ) : scoreField.value2 !== undefined &&
                totalScoreField.value2 !== undefined ? (
                  <FormattedMessage
                    id="account.detail.test.total_score"
                    defaultMessage={i18n['account.detail.test.total_score']}
                    values={{
                      score: `${scoreField.value2}`,
                      totalScore: `${totalScoreField.value2}`
                    }}
                  />
                ) : (
                  undefined
                )}
              </li>
              <li>
                {i18n['appropriateness.test_result']}：
                {resultField.value2 !== undefined
                  ? `${
                      i18n[`appropriateness.test_result.${resultField.value2}`]
                    }${
                      leverageField && leverageField.value2 !== undefined
                        ? `, ${i18n['appropriateness.suggest_leverage']} 1 : ${
                            leverageField.value2
                          }`
                        : ''
                    }`
                  : undefined}
              </li>
            </ul>
          </Radio>
        </td>
      </tr>
    );
  };

  _renderDiffInfo = ({ key, title, formName }) => {
    const {
      diffOwnerInfo: { diffResult }
    } = this.props;

    if (!diffResult[key].length) return undefined;

    return [
      <tr key="title" className={cs['heading']} data-test="info">
        <td colSpan="3">{title}</td>
      </tr>,
      key === 'appropriatenessTestInfo'
        ? this._renderTestRow(diffResult[key])
        : this._renderRow(key, formName, diffResult[key])
    ];
  };

  render() {
    const { onHide, diffOwnerInfo, visible } = this.props;
    const { oldSelected, newSelected } = this.checkWhichSelected();
    const {
      accountId,
      customerAccountId,
      diffResult: { baseInfo, financialInfo, certificatesInfo }
    } = diffOwnerInfo;

    return (
      <Dialog
        width="800"
        visible={visible}
        title={i18n['account.merge_account_owner_info.title']}
        footer={[
          <Button type="primary" onClick={this.onMerge}>
            {i18n['account.merge_account_owner_info.buttons.merge']}
          </Button>,
          <Button onClick={onHide}>
            {i18n['account.merge_account_owner_info.buttons.cancel']}
          </Button>
        ]}
        onCancel={onHide}
      >
        <div>
          <p className={cs['tips']}>
            <FormattedMessage
              id="account.merge_account_owner_info.tips"
              defaultMessage={i18n['account.merge_account_owner_info.tips']}
              values={{
                icon: <i className={`fa fa-exclamation ${cs['icon']}`} />
              }}
            />
          </p>
          <table className={cs['table']}>
            <thead>
              <tr>
                <th />
                <th>
                  <Radio
                    checked={oldSelected}
                    onChange={this.selectAll.bind(this, 'old')}
                  >
                    {accountId}
                  </Radio>
                </th>
                <th>
                  <Radio
                    checked={newSelected}
                    onChange={this.selectAll.bind(this, 'new')}
                  >
                    {customerAccountId.join(' / ')}
                  </Radio>
                </th>
              </tr>
            </thead>
            <tbody>{info.map(this._renderDiffInfo)}</tbody>
          </table>
        </div>
      </Dialog>
    );
  }
}
