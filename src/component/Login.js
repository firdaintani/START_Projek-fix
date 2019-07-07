import React from 'react'
import '../support/css/login.css'
import {Link, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Loader from 'react-loader-spinner'
import {onLogin} from '../1. action'

class Login extends React.Component{
    state={verified:null, error: '', loading : false}

    componentWillReceiveProps(newProps){
        this.setState({verified:newProps.verified, error:newProps.error})
    }
    
    onLogin=()=>{
        var username = this.refs.username.value
        var password = this.refs.password.value
        if(username && password){
       
            this.props.onLogin(username,password)

        }else{
            this.setState({error:'Fill all'})
        }
        
    }

    renderErrorMessege = () => {
        if(this.state.error !== ""){
            return <div class="alert alert-dark mt-3" role="alert">
                        {this.state.error}
            </div>
        }
    }

    renderBtnOrLoading=()=>{
        if(this.props.loading === true){
            return <Loader
                    type="Audio"
                    color="#000000"
                    height="50"	
                    width="50"
                    />
        }else{
            return <input type="button" className="tombol mb-3" value='LOGIN' onClick={this.onLogin} style={{marginTop:'20px', width:'100%'}}></input>
               
        }
      
    }


    render(){
        if(this.props.username !== ""){
            return <Redirect to='/'/>
        }
        return(
            <div className='container' style={{marginTop:'70px', paddingTop:'70px'}}>
               <form style={{marginRight:'300px', marginLeft:'300px'}}>
                
                <div className="form-group">
                    <label htmlFor="Username">Username</label><br></br>
                    <input type="text" className="form-border outline-none" ref='username' placeholder="Enter username" />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label><br></br>
                    <input type="password" className="form-border outline-none" placeholder="Password" ref='password'/>
                </div>
                
                {this.renderBtnOrLoading()}  
             
                {this.renderErrorMessege()}
                <Link to='/register'><small  className='form-text text-muted'  style={{marginTop:'10px', display:'inline', float:'left'}}>Dont have an account?Click here</small></Link>
                {/* <a href='/forgotpassword' style={{float:'right', marginTop:'10px'}}>Forgot password?</a> */}
                <Link to='/forgotpassword'><small  className='form-text'  style={{marginTop:'10px', display:'inline', float:'right'}}>Forgot password?</small></Link>
               
                </form>


            </div>
        )
    }
}

const mapStatetoProps=(state)=>{
    return {
        username : state.user.username,
        loading : state.user.loading,
        error : state.user.error,
        verified : state.user.verified
    }
}

export default connect(mapStatetoProps,{onLogin})(Login)