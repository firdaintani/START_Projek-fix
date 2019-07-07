import React from 'react'
import Axios from 'axios';
import { urlApi } from '../support/urlApi';
import {connect} from 'react-redux'
// import {withRouter} from 'react-router-dom'
import Swal from 'sweetalert2';

class NewPassword extends React.Component{
    state={error : ''}
    savePassword=()=>{
        var email = this.props.match.params.email
        var password = this.refs.new_password.value
        var confirm_password = this.refs.confirm_password.value
        if(password!==confirm_password){
            this.setState({error : 'password not match.'})
        }else{
            this.setState({error : ''})
            Axios.put(urlApi+'/user/changepassword', {email,password})
                .then((res) => {
                    if (res.data.error) {
                        this.setState({error : res.data.msg})
                    } else {
                        Swal.fire("success", "Password changed", "success")
                        .then((value) => {
                            this.props.history.push('/profile')
                        });
                    }
                })
                .catch((err) => console.log(err))
            
        }
    }
    render(){
        return(
            <div className='container' style={{ marginTop: '70px', paddingTop: '70px' }}>
            <center><h3 className='navbar-brand'>CREATE NEW PASSWORD</h3></center>
            <form style={{ marginRight: '300px', marginLeft: '300px', marginTop: '30px' }}>

                <div className="form-group">
                    <label >New password : </label><br></br>
                    <input type="password" className="form-border outline-none" ref='new_password' />

                </div>
                <div className="form-group">
                    <label >Confirm password : </label><br></br>
                    <input type="password" className="form-border outline-none" ref='confirm_password' />

                </div>
                <input type="button" onClick={this.savePassword} className="tombol" value='SAVE' style={{ width: '100%' }}></input>
                {this.state.error ?
                    <div class="alert alert-danger" role="alert">
                        {this.state.error}
                    </div>
                    : null

                }

            </form>


        </div>
        
            )
    }
}

const mapStateToProps=(state)=>{
    return{
        username : state.user.username
    }
}

export default connect(mapStateToProps)(NewPassword)