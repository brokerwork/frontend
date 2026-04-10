import { combineReducers } from 'redux';

import * as liveReducers from '../path/Video/Live/controls/reducers';
import * as videoReducers from '../path/Video/VideoMgmt/controls/reducers';
import * as sourceSetReducer from '../path/Follow/SourceSetting/controls/reducers';

export const videoLive = combineReducers({ ...liveReducers });
export const videoRecords = combineReducers({ ...videoReducers });
export const sourceSetting = combineReducers({ ...sourceSetReducer });
