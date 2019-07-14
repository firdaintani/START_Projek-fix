import React from 'react'
import Axios from 'axios';
import { urlApi } from '../support/urlApi';
import { withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'
import './../support/css/verifyemail.css'
import validator from 'validator'

class ForgotPassword extends React.Component {
    state = { error: '' }

    checkEmail = () => {
        
        var email = this.refs.email.value
        // alert(email)
        if (validator.isEmail(email)) {
           
            Axios.get(urlApi + '/user/checkemail?email=' + email)
                .then((res) => {
                    if (res.data.error) {
                        this.setState({error: res.data.msg})
                    }
                    else {
                        if (res.data.length > 0) {
                            Swal.fire('success', 'Check your email to see the link to change your password.', 'success')
                            // this.props.history.push('/newpassword/' + email)
                            this.props.history.push('/login')
                        } else {

                            this.setState({error : 'Wrong email. Try again'})
                        }
                    }

                })
                .catch((err) => {
                    console.log(err)
                })
        }else{
            alert('salah')
        }
    }

    render() {
        return (
            <div className='container' style={{ marginTop: '70px', paddingTop: '70px' }}>
                <center><h3 className='navbar-brand'>INPUT YOUR EMAIL</h3></center>
                <form style={{ marginRight: '300px', marginLeft: '300px', marginTop: '30px' }}>

                    <div className="form-group">
                        <label >Your email : </label><br></br>
                        <input type="text" className="form-border outline-none" ref='email' />

                    </div>

                    <input type="button" onClick={this.checkEmail} className="tombol" value='NEXT' style={{ width: '100%' }}></input>
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
export default withRouter(ForgotPassword)