import React from 'react'
import '../support/css/navbar.css'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {onLogout} from '../1. action'
import swal from 'sweetalert'
import {withRouter} from 'react-router-dom'

import DynamicToolTip from './Tooltip'

class Navbar extends React.Component{
      logoutBtn=()=>{
        swal({
          
            text: "Do you want to logout?",
            icon: "warning",
            buttons: true,
           
          })
          .then((willLogout) => {
            if (willLogout) {
            this.props.onLogout()
              swal("You logout", {
                icon: "success",
              });
              this.props.history.push('/');
            }
          });
         
      }

    render (){

        return (
           
            <div className='navbar-fixed'>

            <nav className="navbar navbar-expand-md navbar-light" ref='navbar' style={{overflow:'visible'}}>
               
                <div className="w-100">                  
                </div>
                <div className="mx-auto">
                    <a className="navbar-brand mx-auto" href="/">ST-ART</a>
                    
                </div>
                <div className="navbar-collapse w-100">
                    <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                    {
                      this.props.role==='user' ?
                      <div className='mt-2'>
                        <Link to='/profile'><p style={{display:'inline', cursor:'pointer',color:'black'}}>Hi,{this.props.username}!</p></Link>
                        <Link to='/wishlist'><i style={{display:'inline'}} className="fas fa-heart nav-link" id='wishlist'><sup><span className="badge badge-danger">{this.props.wishlist !== 0 ? this.props.wishlist : null}</span></sup></i></Link> 
                        <Link to='/cart'><i style={{display:'inline'}} className="fas fa-shopping-cart nav-link" id='cart'><sup><span className="badge badge-danger">{this.props.cart !== 0 ? this.props.cart : null}</span></sup></i></Link> 
                       
                         <DynamicToolTip textTooltip={"Wishlist"} idTooltip={"wishlist"}/>
                  
                  <DynamicToolTip textTooltip={"Cart"} idTooltip={"cart"}/>
                        </div>: null
                  }
                 
                    </li>
                    <li className="nav-item">
                           { this.props.username==='' ?
                           <span>
                           <Link to='/login'><input className='tombol font' type='button' value='LOGIN'/></Link> &nbsp;
                        <Link to='/register'><input className='tombol-black font' type='button' value='REGISTER'/></Link>
                        </span>
                        : 
                        <input className='tombol font' type='button' value='LOGOUT' onClick={this.logoutBtn}/>
                        }
                    </li>
                   
                    </ul>
                </div>
                </nav>
                
                </div>
          
            )
    }
}

const mapStateToProps=(state)=>{
    return {
      username : state.user.username,
      cart : state.user.cart,
      role : state.user.role,
      wishlist : state.wishlist.wishlist
    }
  }
  
  export default withRouter(connect(mapStateToProps, {onLogout})(Navbar))
