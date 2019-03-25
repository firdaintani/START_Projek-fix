import React from 'react'
import '../support/css/login.css'
import {Link} from 'react-router-dom'
export default class Login extends React.Component{
    render(){
        return(
            <div className='container' style={{marginTop:'70px', paddingTop:'70px'}}>
               <form style={{marginRight:'300px', marginLeft:'300px'}}>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label><br></br>
                    <input type="email" className="form-border" aria-describedby="emailHelp" placeholder="Enter email" />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label><br></br>
                    <input type="password" className="form-border" placeholder="Password" />
                </div>
                {/* <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                </div> */}
                <input type="button" className="tombol" value='LOGIN' style={{marginTop:'20px'}}></input> OR  &nbsp;
                <input type="button" className="tombol" value='LOGIN WITH GOOGLE' style={{marginTop:'20px'}}></input><br></br>
                <Link to='/register'><small  className='form-text text-muted'  style={{marginTop:'10px'}}>Dont have an account?Click here</small></Link>
                
                </form>


            </div>
        )
    }
}