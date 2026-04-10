import { combineReducers } from 'redux';

import * as customersReducers from './path/Customers/controls/reducers';
import * as contactsReducers from './path/Contacts/controls/reducers';
import * as opportunityReducers from './path/SalesOpportunity/controls/reducers';
import * as trashReducers from './path/Customers/path/Trash/controls/reducers';
import * as contractReducers from './path/Contracts/controls/reducers';
import * as billReducers from './path/Bills/controls/reducers';
import * as deploysReducers from './path/ProductDeploy/controls/reducers';
import * as duplicateReducers from './path/Customers/path/Duplicate/controls/reducers';
import * as userAddBinding from './path/AddUserAndBind/controls/reducers';

export const customers = combineReducers({ ...customersReducers });
export const contacts = combineReducers({ ...contactsReducers });
export const opportunities = combineReducers({ ...opportunityReducers });
export const trashes = combineReducers({ ...trashReducers });
export const duplicates = combineReducers({ ...duplicateReducers });
export const contracts = combineReducers({ ...contractReducers });
export const bills = combineReducers({ ...billReducers });
export const deploys = combineReducers({ ...deploysReducers });
export const userAddBind = combineReducers({ ...userAddBinding });
