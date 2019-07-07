const INITIAL_STATE={username : "",role : "",error : "",loading:false, email:'', cookie : false, verified:0, cart : 0, profile_image : null}

export default (state=INITIAL_STATE, action)=>{
    if(action.type==='LOGIN_SUCCESS'){
        return {...INITIAL_STATE, username : action.payload.username, role:action.payload.role,verified:action.payload.verified,cookie:true, email:action.payload.email}
    }else if (action.type==='LOADING'){
        return {...INITIAL_STATE, loading:true,cookie:true}
    }else if (action.type==='USER_NOT_FOUND'){
        return {...INITIAL_STATE, error:'username or password wrong',cookie:true}
    }else if(action.type==='RESET_USER'){
       
        return {...INITIAL_STATE,cookie:true}
    }else if(action.type==='USERNAME_NOT_AVAILABLE'){
        return {...INITIAL_STATE, error:action.payload,cookie:true}
    }else if (action.type=== 'COOKIE_CHECKED'){
        return {...state,cookie:true}
    }else if(action.type==='REGISTER_SUCCESS'){
        return {...INITIAL_STATE,cookie:true}
    }else if(action.type==='NOT_VERIFIED'){
        return {...INITIAL_STATE, error:`Please verify your account first. Click <a href='http://localhost:3000/verify?username=${action.payload}'>this link</a> to verify`, cookie:true}
    }else if(action.type==='CART_COUNT'){
        return {...state, cart : action.payload}
    }else if(action.type==='PROFILE_IMAGE'){
        return {...state, profile_image: action.payload}
    }
    else{
    return state
    }
}