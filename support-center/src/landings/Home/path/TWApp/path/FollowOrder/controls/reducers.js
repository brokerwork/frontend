import { combineReducers } from "redux";
import * as symbolReducers from "../path/SymbolSetting/controls/reducers";
import * as connectorReducers from "../path/ConnectorSetting/controls/reducers";

export const symbol = combineReducers({ ...symbolReducers });
export const connector = combineReducers({ ...connectorReducers });
