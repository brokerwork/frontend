import { isFSA  } from 'flux-standard-action';
import { push } from 'react-router-redux';

export default function transitionMiddleware( {dispatch} ) {
  return function ( next ) {
    return function ( action ) {
      if ( isFSA(action) ) {
        let meta = action.meta;
        if ( meta && typeof meta.transition === 'function' ) {
          let pathOrLoc = meta.transition(action); 
          dispatch( push(pathOrLoc) )
        }
      }
      return next( action );
    }
  }
}