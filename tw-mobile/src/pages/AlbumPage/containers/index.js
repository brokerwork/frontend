import React from 'react';
import { connect } from 'react-redux';
import { AlbumPage } from '../components/index';
import * as actions from '../actions';

export default connect(
	({ albumPage }) => ({ album: albumPage.album }),
	{ ...actions }
)(AlbumPage)