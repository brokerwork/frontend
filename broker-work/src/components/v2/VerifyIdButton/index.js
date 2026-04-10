import Root from './containers/Root';
import VerifyForAccount from './components/ForAccountInfo';
import { TYPE_KEY_MAP, CARD_LABEL_REGEXP } from './constants';
import { getIdByIdType, getDataOfOwner, getResultOfOwner } from './utils';

export const VerifyButton = Root;
export const VERIFY_TYPE_KEY_MAP = TYPE_KEY_MAP;
export const getVerdifyIdByIdType = getIdByIdType;
export const getVerifyData = getDataOfOwner;
export const getVerifyResult = getResultOfOwner;

export default VerifyForAccount;
