import cs from './AccountInfo.less';
import Form from 'components/Form';

export default class AccountInfo extends PureComponent {
  _renderRow = (key, col, idx) => {
    return (
      <Form.Item col={2} key={idx} className={cs['pdf-item']}>
        <Form.Label title={col.label} className={cs['label']}>
          {`${col.label}: `}
        </Form.Label>
        <Form.Control className={cs['control']}>{col.value}</Form.Control>
      </Form.Item>
    );
  };

  render() {
    const { data } = this.props;

    return (
      <div
        className={`panel panel-default ${cs['card-panel']}`}
        id="exportContent"
      >
        <div className={`panel-body ${cs['panel-body']}`}>
          <h3 className={cs['heading-center']}>
            {data.companyName} &nbsp;APPLICATION REPORT
          </h3>
          {data && data.applicationDetail.length ? (
            <div>
              <h3 className={cs['heading-sm']}>Application Details</h3>
              <Form>
                {data.applicationDetail.map(
                  this._renderRow.bind(this, 'applicationDetail')
                )}
              </Form>
            </div>
          ) : (
            undefined
          )}
          {data && data.productionSelection.length ? (
            <div>
              <h3 className={cs['heading-sm']}>Production Selection</h3>
              <div className={cs['center']}>
                I/We select {data.productionSelection}
              </div>
            </div>
          ) : (
            undefined
          )}
          <h3 className={cs['heading-sm']}>Applicant</h3>
          {data && data.ownerBaseInfo.length ? (
            <div>
              <h3 className={cs['heading']}>Basic Information</h3>
              <Form>
                {data.ownerBaseInfo.map(
                  this._renderRow.bind(this, 'accountBaseInfo')
                )}
              </Form>
            </div>
          ) : (
            undefined
          )}
          {data && data.ownerFinanceNInfo.length ? (
            <div>
              <h3 className={cs['heading']}>Financial Information</h3>
              <Form>
                {data.ownerFinanceNInfo.map(
                  this._renderRow.bind(this, 'financialInfo')
                )}
              </Form>
            </div>
          ) : (
            undefined
          )}
          {data && data.ownerCertificateInfo.length ? (
            <div>
              <h3 className={cs['heading']}>Documents</h3>
              <Form>
                {data.ownerCertificateInfo.map(
                  this._renderRow.bind(this, 'certificatesInfo')
                )}
              </Form>
            </div>
          ) : (
            undefined
          )}
          <div>
            <h3 className={cs['heading']}>Contact details</h3>
            <Form>
              <Form.Item col={2}>
                <Form.Label className={cs['label']}>Phone:</Form.Label>
                <Form.Control className={cs['control']}>
                  {data.phone}
                </Form.Control>
              </Form.Item>
              <Form.Item col={2}>
                <Form.Label className={cs['label']}>Email:</Form.Label>
                <Form.Control className={cs['control']}>
                  {data.email}
                </Form.Control>
              </Form.Item>
            </Form>
          </div>
          <h3 className={cs['heading-sm']}>Conditions and Acceptance</h3>
          <div>
            <div className={cs['footer-text']}>
              <div className={cs['agree-header']}>
                I/We acknowledge that I/We have received, read, understood and
                agree to the following documents supplied by {data.companyName}
              </div>
              <div className={cs['agree-content']}>
                {data.companyName} Terms and Conditions Accepted on
                {data.signTime}
              </div>
              <div className={cs['agree-content']}>
                {data.companyName} Product Disclosure Statement Accepted on
                {data.signTime}
              </div>
              <div className={cs['agree-content']}>
                {data.companyName} Financial Services Guide Accepted on
                {data.signTime}
              </div>
            </div>
          </div>
          <div className={cs['footer-align-right']}>
            Login: {data['accountId']}
          </div>
        </div>
      </div>
    );
  }
}
