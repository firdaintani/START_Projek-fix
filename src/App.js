import React, { Component } from 'react';
import './App.css';
import Navbar from './component/Navbar'
import Home from './component/home/Header'
import { Route } from 'react-router-dom';
import Product from './component/Product'
import Login from './component/Login'
import Register from './component/Register'
import ProductDetail from './component/ProductDetail.js'
import Cart from './component/Cart'
import ScrollToTop from './component/scrollToTop'
import SlideMenu from './component/SlideMenu'
import TransactionDetail from './component/transaction/TransactionDetail'
import TabTransaction from './component/transaction/TabTrasaction'
import PageNotFound from './component/PageNotFound'
import Checkout from './component/Checkout.js'
import FinishCheckout from './component/FinishedCheckout'
import VerifyEmail from './component/VerifyEmail'
import ManageCategory from './component/admin/ManageCategory'
import ManageBrand from './component/admin/ManageBrand'
import ManageProduct from './component/admin/ManageProduct'
import AddProduct from './component/admin/AddProducts'
import Report from './component/Report'
import Wishlist from './component/Wishlist'
import Profile from './component/Profile'
import NewPassword from './component/NewPassword'
import cookie from 'universal-cookie'
import { keepLogin, cookieChecked , countCart, countWishlist, getProfileImage} from './1. action'
import { connect } from 'react-redux'
import { withRouter, Switch } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import ChangePassword from './component/ChangePassword';
import ForgotPassword from './component/ForgotPassword';
var objCookie = new cookie()


class App extends Component {
  componentDidMount() {

    var username = objCookie.get('username')
    if (username !== undefined) {
      this.props.keepLogin(username)
      this.props.countCart(username)
      this.props.countWishlist(username)
      
      this.props.getProfileImage(username)
    }
    else {
      this.props.cookieChecked()
    }

  }

  componentWillReceiveProps(newProps){
    this.props.countCart(newProps.username)
    this.props.countWishlist(newProps.username)
    this.props.getProfileImage(newProps.username)
    
  }
  render() {
    if (this.props.cookie) {
      return (
        <div>
          <div style={{ position: 'fixed', width: '100%', top: 0, zIndex: 100 }}>
          <SlideMenu />
            <Navbar />
          </div>

          <ScrollToTop>
            <Switch>
            <Route path='/' component={Home} exact />
            <Route path='/login' component={Login} exact />
            <Route path='/register' component={Register} exact />
            <Route path='/product-detail/:id' component={ProductDetail} exact />
            <Route path='/cart' component={Cart} exact />
            <Route path='/manage-category' component={ManageCategory} exact />
            <Route path='/manage-brand' component={ManageBrand} exact />
            <Route path='/manage-product' component={ManageProduct} exact />
            <Route path='/add-product' component={AddProduct} exact />
            <Route path='/verify' component={VerifyEmail} exact />
            <Route path='/product' component={Product}/>
            <Route path='/transaction-detail/:id' component={TransactionDetail} exact />
            <Route path='/transaction' component={TabTransaction} />
            <Route path='/checkout' component={Checkout} exact/>
            <Route path='/finishcheckout/:id' component={FinishCheckout} exact/>
            <Route path='/report' component={Report} exact/>
            <Route path='/wishlist' component={Wishlist} exact />
            <Route path='/profile' component={Profile} exact />
            <Route path='/changepassword' component={ChangePassword} exact />
            <Route path='/newpassword/:email' component={NewPassword} exact />
            <Route path='/forgotpassword' component={ForgotPassword} exact />
            
            <Route path='*' component={PageNotFound} exact/>
            </Switch>
          </ScrollToTop>
        
        </div>
      );
    }

    return <div>
      <center>
        <Loader
          type="ThreeDots"
          color="#000000"
          height="300"
          width="300"
        />
      </center>
    </div>
  }
}

const mapStateToProps = (state) => {
  return {
    cookie: state.user.cookie,
    role : state.user.role,
    username : state.user.username
  }
}

export default withRouter(connect(mapStateToProps, { keepLogin, cookieChecked, countCart, countWishlist, getProfileImage})(App));
