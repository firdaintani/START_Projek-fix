import {combineReducers} from 'redux'
import userGlobal from './userGlobal'
import wishlistGlobal from './wishlistGlobal'
export default combineReducers({
 
        user: userGlobal, wishlist : wishlistGlobal
 
})