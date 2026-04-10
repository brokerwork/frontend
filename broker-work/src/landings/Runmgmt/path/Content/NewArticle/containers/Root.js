import { connect } from 'react-redux';
import Root from '../components/Root';

import { getArticleById, saveArticle } from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';

export default connect(
  ({ appContentArticleEdit: { data } }) => ({
    data
  }),
  {
    showTopAlert,
    getArticleById,
    saveArticle
  }
)(Root);
