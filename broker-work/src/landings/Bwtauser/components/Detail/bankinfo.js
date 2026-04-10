import { Card } from 'lean-ui';
import * as cs from './index.less';
import i18n from '../../../../utils/i18n';
import { Form } from 'lean-ui';
const FormItem = Form.Item;
const FormLabel = Form.Label;
const FormControl = Form.Control;

const BANK_DETAIL_MAP = {
  BNI: {
    bankName: 'Bank Negara Indonesia',
    bicCode: 'BNINIDJA',
    bankAddress: 'Jl. Jenderal Sudirman Kav. 1 Jakarta 1002'
  }
};

export default class BankInfo extends Component {
  render() {
    const {
      vaInfo: { account, bankName: bankNameAbbr, currency, name } = {}
    } = this.props;
    const { bankName, bicCode, bankAddress } =
      BANK_DETAIL_MAP[bankNameAbbr] || {};
    return (
      <Card className={cs['card-style']}>
        <h3 className={cs['form-title']}>
          {i18n['tausermgmt.detail.bankaccount']}
        </h3>
        <Form>
          <FormItem col={2}>
            <FormLabel>
              {i18n['tausermgmt.detail.bankaccount.username']}：
            </FormLabel>
            <FormControl>{name}</FormControl>
          </FormItem>
          <FormItem col={2}>
            <FormLabel>
              {i18n['tausermgmt.detail.bankaccount.bankname']}：
            </FormLabel>
            <FormControl>{bankName}</FormControl>
          </FormItem>
          <FormItem col={2}>
            <FormLabel>
              {i18n['tausermgmt.detail.bankaccount.banknumber']}：
            </FormLabel>
            <FormControl>{account}</FormControl>
          </FormItem>
          <FormItem col={2}>
            <FormLabel>
              {i18n['tausermgmt.detail.bankaccount.currency']}：
            </FormLabel>
            <FormControl>{currency}</FormControl>
          </FormItem>
          <FormItem col={2}>
            <FormLabel>
              {i18n['tausermgmt.detail.bankaccount.biccode']}：
            </FormLabel>
            <FormControl>{bicCode}</FormControl>
          </FormItem>
          <FormItem col={2}>
            <FormLabel>
              {i18n['tausermgmt.detail.bankaccount.address']}：
            </FormLabel>
            <FormControl>{bankAddress}</FormControl>
          </FormItem>
        </Form>
      </Card>
    );
  }
}
