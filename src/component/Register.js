import React from 'react'
import {Link, withRouter,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {onRegister} from '../1. action'
import Loader from 'react-loader-spinner'
import validator from 'validator';

class Register extends React.Component{
    state ={message:'' }
    registerBtn=()=>{
      
        var password = this.refs.reg_password.value
        var confirm_password = this.refs.reg_conf_password.value
        var name = this.refs.reg_name.value
        var username = this.refs.reg_username.value
        var email = this.refs.reg_email.value
        var phone = this.refs.reg_phone.value
        if(password && confirm_password && name && username && email && phone){
            if(validator.isEmail(email)){
            if(password===confirm_password){
           
                var objData = {username, password,name, email,phone}
                this.props.onRegister(objData, this.props.history)
    
                this.setState({message:''})
              
            
            }else{
              
                this.setState({message:'Password not same'})
            }
        }else{
            this.setState({message:'Email must in valid format'})
        }
    
        }
        else{
            this.setState({message : 'Fill all the form'})
        }
    }

    componentWillReceiveProps(newProps){
        this.setState({message:newProps.error})
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
            return <input type="button" className="tombol" value='REGISTER' style={{marginTop:'20px', width:'100%'}} onClick={this.registerBtn}></input>
               
        }
      
    }

    renderErrorMessege = () => {
        if(this.state.message !== ""){
            return <div class="alert alert-dark mt-3" role="alert">
                        {this.state.message}
            </div>
        }
    }


    render(){
        if(this.props.username !== ""){
           
            return <Redirect to='/'/>
        }

       
        return(
            <div className='container' style={{marginTop:'50px', paddingTop:'50px'}}>
            <form style={{marginRight:'300px', marginLeft:'300px'}}>
            <div className="form-group">
                 <label>Name</label><br></br>
                 <input type="text" className="form-border outline-none" placeholder="Enter Your Full Name" ref='reg_name' />
               </div>
             <div className="form-group">
                 <label>Email address</label><br></br>
                 <input type="email" className="form-border outline-none" aria-describedby="emailHelp" placeholder="Enter email" ref='reg_email' />
                 <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
             </div>
             <div className="form-group">
                 <label>Username</label><br></br>
                 <input type="text" className="form-border outline-none" placeholder="Enter Your username" ref='reg_username'/>
               </div>
             <div className="form-group">
                 <label>Phone Number</label><br></br>
                 <input type="number" className="form-border outline-none"  placeholder="Enter Phone Number" ref='reg_phone'/>
                 
             </div>
             <div className="form-group">
                 <label>Password</label><br></br>
                 <input type="password" className="form-border outline-none" placeholder="Password" ref='reg_password' />
             </div>
             <div className="form-group">
                 <label>Confirm Password</label><br></br>
                 <input type="password" className="form-border outline-none" placeholder="Confirm Password" ref='reg_conf_password' />
             </div>
               
             {this.renderBtnOrLoading()}
              {/* <input type="button" className="tombol" value='REGISTER' style={{marginTop:'20px', width:'100%'}} onClick={this.registerBtn}></input> */}
             
             {this.renderErrorMessege()}
             <Link to='/login'> <small className='form-text text-muted' style={{marginTop:'10px'}}>Already have an account?Click here</small></Link>
             </form>


         </div>
        )
    }
}


const mapStateToProps=(state)=>{
    return {
        username : state.user.username,
        error : state.user.error,
        loading : state.user.loading
    }
}

export default withRouter(connect(mapStateToProps, {onRegister})(Register))