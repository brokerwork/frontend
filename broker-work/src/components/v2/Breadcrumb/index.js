import { Breadcrumb } from 'lean-ui';
import { Link } from 'react-router-dom';

function itemRender(route, params, routes, paths) {
  const last = routes.indexOf(route) === routes.length - 1;
  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link to={route.path}>{route.breadcrumbName}</Link>
  );
}

const BreadCrumb = ({ routes }) => (
  <Breadcrumb itemRender={itemRender} routes={routes} separator=">" />
);

export default BreadCrumb;

// 只需要传routes即可
// const routes = [
//   {
//     path: '/accountmgmt',
//     breadcrumbName: i18n['account.title']
//   },
//   {
//     path: '',
//     breadcrumbName: i18n['account.detail']
//   }
// ];
