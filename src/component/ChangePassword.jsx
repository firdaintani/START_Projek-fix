import React from 'react'
import Axios from 'axios';
import { urlApi } from '../support/urlApi';
import {withRouter} from 'react-router-dom'
import Swal from 'sweetalert2'
import './../support/css/verifyemail.css'
import {connect} from 'react-redux'

class ChangePassword extends React.Component {
    state = { password:'', error: '' }
    
    checkPassword=()=>{
        var password = this.refs.current_password.value
        Axios.get(urlApi+'/user/checkpassword?username='+this.props.username+'&password='+password)
        .then((res)=>{
            if (res.data.error) {
                Swal.fire("Error", res.data.msg, "error")
            }
            else {
                if(res.data.length>0){
                    this.props.history.push('/newpassword/'+this.props.email)
                }else{
                    
                Swal.fire("Error", "Wrong password. Try again", "error")
                }
            }
    
        })
    .catch((err)=>{
        console.log(err)
    })        
    }

    render() {
        return (
            <div className='container' style={{ marginTop: '70px', paddingTop: '70px' }}>
                <center><h3 className='navbar-brand'>CHANGE PASSWORD</h3></center>
                <form style={{ marginRight: '300px', marginLeft: '300px', marginTop: '30px' }}>

                    <div className="form-group">
                        <label >Your current password : </label><br></br>
                        <input type="password" className="form-border outline-none" ref='current_password' />

                    </div>

                    <input type="button" onClick={this.checkPassword} className="tombol" value='NEXT' style={{ width: '100%' }}></input>
                    {this.state.error ?
                        <div class="alert alert-danger" role="alert">
                            {this.state.error}
                        </div>
                        : null

                    }

                    <a href='/forgotpassword' style={{float:'right', marginTop:'10px'}}>Forgot password?</a>

                </form>


            </div>
        )
    }
}
const mapStateToProps=(state)=>{
    return {
        username : state.user.username, email : state.user.email
    }
}
export default withRouter(connect(mapStateToProps)(ChangePassword))