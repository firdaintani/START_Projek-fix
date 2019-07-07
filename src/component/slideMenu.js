import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { MDBCollapse } from "mdbreact";
import '../support/css/slideMenu.css'
import emptyavatar from '../support/img/avatar-blank.png'

import { urlApi } from '../support/urlApi';
import {getProfileImage} from '../1. action'

class SlideMenu extends React.Component {

  state = {
    menuOpen: false, collapseID: "", profil_image: null
  }

  
  toggleCollapse = collapseID => () => {
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : ""
    }));
  }

  // This keeps your state in sync with the opening/closing of the menu
  // via the default means, e.g. clicking the X, pressing the ESC key etc.
  handleStateChange(state) {
    this.setState({ menuOpen: state.isOpen })
  }


  toggle = () => {


    this.setState({
      menuOpen: !this.state.menuOpen
      , collapseID: ""
    });

  }

  // This can be used to close the menu, e.g. when a user clicks a menu item
  closeMenu = () => {
    this.setState({ menuOpen: false })
  }

  // This can be used to toggle the menu, e.g. when using a custom icon
  // Tip: You probably want to hide either/both default icons if using a custom icon
  // See https://github.com/negomi/react-burger-menu#custom-icons
  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen })
  }

  render() {

    return (
      <div>
        <Menu isOpen={this.state.menuOpen}
          onStateChange={(state) => this.handleStateChange(state)}>
          { this.props.role==='user' ?
            <div style={{backgroundColor:'black', color:'white', paddingTop:'17px', paddingBottom:'1px'}}>
              <center className='outline-none'>
          {
            this.props.profile_image ?
            <Link to='/profile' className='menu-item outline-none' onClick={this.closeMenu}><img src={`${urlApi}/${this.props.profile_image}`} alt='avatar' className='avatar-img'></img></Link>
            :<Link to='/profile' className='menu-item outline-none' onClick={this.closeMenu}><img src={emptyavatar} alt='avatar' className='avatar-img'></img></Link>
            
          }
            <div >
              <Link to='/profile' className='username'>{this.props.username}</Link>
             
            </div>
              <p style={{fontSize:'14px',cursor:'default'}}>STARTPay : RP. 1000</p>
            </center>
          </div> : null
          }
          <Link to='/' className='menu-item outline-none' onClick={this.closeMenu} >Home</Link>
          {
            this.props.role==='user' ?
            <Link className="menu-item outline-none" to='/profile' onClick={this.closeMenu}>
            Profile
        </Link>
          : null
          }
          <Link className="menu-item outline-none" to='/product/all' onClick={this.closeMenu}>
            Shop
        </Link>
          {
            this.props.role === 'admin' ?
              <div className='outline-none'>
                <p onClick={this.toggleCollapse("basicCollapse")} style={{ cursor: 'pointer' }} className='menu-item gada-outline'>Manage &nbsp;&nbsp;&nbsp; <i className="fas fa-angle-down"></i></p>
                <MDBCollapse id="basicCollapse" isOpen={this.state.collapseID}>
                  <ul>
                    <Link to='/manage-product'><li className='menu-item' onClick={this.toggle}>Manage Product</li></Link>
                    <Link to='/manage-category'><li className='menu-item' onClick={this.toggle}>Manage Category</li></Link>
                    <Link to='/manage-brand'><li className='menu-item' onClick={this.toggle}>Manage Brand</li></Link>
                    <Link to='/transaction'><li className='menu-item' onClick={this.toggle}>Manage Transaction</li></Link>

                  </ul>
                </MDBCollapse>
                
               <Link to='/report' className='menu-item outline-none' onClick={this.closeMenu} >Report</Link>
              </div> : this.props.role === 'user' ?

                <Link to='/transaction' ><p className='menu-item outline-none' onClick={this.closeMenu}>Transaction</p></Link>
                : null
          }

        </Menu>

      </div>
    );
  };
}


const mapStateToProps = (state) => {
  return {
    role: state.user.role, username : state.user.username, profile_image : state.user.profile_image
  }
}

export default connect(mapStateToProps, {getProfileImage})(SlideMenu)