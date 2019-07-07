const INITIAL_STATE={wishlist : 0}

export default (state=INITIAL_STATE, action)=>{
    if(action.type==='WISHLIST_COUNT'){
        return {...state, wishlist: action.payload}
    }
    else{
        return state
    }
}