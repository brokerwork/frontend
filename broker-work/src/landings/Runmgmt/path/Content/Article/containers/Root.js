import { connect } from 'react-redux';
import Root from '../components/Root';

import {
  getArticles,
  orderArticle,
  removeArticle,
  setParams,
  sortList
} from '../controls/actions';
import { showTipsModal, showTopAlert } from 'commonActions/actions';

export default connect(
  ({ appContentArticles: { articles, params } }) => ({
    data: articles,
    params
  }),
  {
    getArticles,
    removeArticle,
    orderArticle,
    setParams,
    showTipsModal,
    showTopAlert,
    sortList
  }
)(Root);
