import { handleActions } from 'redux-actions';
import {
  EDIT_FOOTER_FIELDS_MAP,
  PRODUCT_DETAILS_FIELDS_MAP,
  EDIT_HEADER_FIELDS_MAP
} from '../constants';

export const editFooterFieldsMap = handleActions({}, EDIT_FOOTER_FIELDS_MAP);
export const detailsFieldsMap = handleActions({}, PRODUCT_DETAILS_FIELDS_MAP);
export const editHeaderFieldsMap = handleActions({}, EDIT_HEADER_FIELDS_MAP);
