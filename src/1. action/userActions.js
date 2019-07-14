import Axios from "axios";
import cookie from 'universal-cookie'
import {urlApi} from '../support/urlApi'
import swal from "sweetalert";


var objCookie = new cookie()

export const onLogin=(username,password)=>{
   return (dispatch)=>{
    dispatch({
        type: 'LOADING',
    })
    Axios.get(urlApi + '/login?username='+username+'&password='+password)
    .then((res)=>{
         if(res.data.error)
         swal("Error",res.data.msg,"error")
         else{
             if(res.data.length>0){
                
                if(res.data[0].verified===0){
                    
                    dispatch({
                        type:'NOT_VERIFIED',
                        payload : res.data[0].username
                    })
                }else{
                dispatch({
                    type:'LOGIN_SUCCESS',
                    payload : res.data[0]
                })
                objCookie.set('username', username, {path : '/'})
            }
            }
            else{
                dispatch({
                    type:'USER_NOT_FOUND'
                })
            }
         }
    })
    .catch((err)=>console.log(err))
      
   }    
    
}

export const keepLogin=(username)=>{
    return(dispatch) => {
        Axios.get(urlApi + '/user/getuser',{params : {username}})
        .then((res) => {
            if(res.data.length > 0){
                dispatch({
                    type : 'LOGIN_SUCCESS',
                    payload : res.data[0]
                })
            }
        })
        .catch((err) => console.log(err))
    }
}


export const onLogout = () => {
    objCookie.remove('username')
    
    return {
        type : 'RESET_USER'
    }
}

export const onRegister=(objData,history)=>{
    return (dispatch)=>{
        dispatch({
            type:'LOADING'
        })
        Axios.post(urlApi+'/register',objData)
        .then((res)=>{
            if(res.data.error){
            
            dispatch({
                type:'USERNAME_NOT_AVAILABLE',
                payload:res.data.msg.includes('email_UNIQUE') ? 'Email already registered. Try other email' : 'Username already exist. Try another username.'

            })
        }
         else{
            swal({
                title: "Success!",
                text: "Register success! Please check your email for your verification",
                icon: "success",
                
              })
              .then((value)=>{
                history.push('/verify?username='+objData.username)

              })
              
                dispatch({
                    type:'REGISTER_SUCCESS',
                    
                })
         }
        })
    }
}

export const cookieChecked = () => {
    return {
        type : 'COOKIE_CHECKED'
    }
}

export const countCart=(username)=>{
    return (dispatch)=>{
    
    Axios.get(urlApi+'/cart/count?username='+username)
    .then((res)=>{
        if(res.data.error){
            swal("Error", res.data.msg, "error")
        }else{
            dispatch({
                type: 'CART_COUNT',
                payload : res.data[0].total_cart
            })
        }
    })
    .catch((err)=>console.log(err))

    }

}

export const countWishlist=(username)=>{
    return (dispatch)=>{
    
        Axios.get(urlApi+'/wishlist/count/'+username)
        .then((res)=>{
            if(res.data.error){
                swal("Error", res.data.msg, "error")
            }else{
                dispatch({
                    type: 'WISHLIST_COUNT',
                    payload : res.data[0].total
                })
            }
        })
        .catch((err)=>console.log(err))
    
        }
    
}

export const getProfileImage=(username)=>{
    return (dispatch)=>{
    
        Axios.get(urlApi+'/user/getpict?username='+username)
        .then((res)=>{
            if(res.data.error){
                swal("Error", res.data.msg, "error")
            }else{
                dispatch({
                    type: 'PROFILE_IMAGE',
                    payload : res.data[0].profil_image
                })
            }
        })
        .catch((err)=>console.log(err))
    
        }
}