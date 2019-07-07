import React from 'react'
import { withRouter } from 'react-router-dom'
import Currency from 'react-currency-formatter';
import '../support/css/productList.css'
import { urlApi } from '../support/urlApi'
import {connect} from 'react-redux'
import Axios from 'axios'
import swal from 'sweetalert'
import DynamicToolTip from './Tooltip'
import Swal from 'sweetalert2'
import { countCart,countWishlist } from '../1. action'

class ProductList extends React.Component {
    state = { product: [] }

    toProdDetail = (id) => {
        this.props.history.push('/product-detail/' + id);
    }

    editWishlist=(id, product_id)=>{
            if(this.props.username){
                if(id){
                    Axios.delete(urlApi+'/wishlist/delete/'+id)
                    .then((res)=>{
                        if(res.data.error){
                            Swal.fire('error',res.data.msg,'error')
                        }else{
                            
                            this.props.countWishlist(this.props.username)
                            this.props.func()
                            Swal.fire("success", "Product deleted from wishlist", "success")
                        }
                    })
                    .catch((err)=>console.log(err))
                }else{
                 
                    Axios.post(urlApi+'/wishlist/add', {username : this.props.username, id_product : product_id}
                       )
                       .then((res) => {
                        if (res.data.error) {
                            swal('Error', res.data.msg, "error")
                        } 
                        else{
                            this.props.countWishlist(this.props.username)
                            this.props.func()
                            
                            Swal.fire("success", "Product added to wishlist", "success")
                        }
                        
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
        
        
            }
        }
        else{
            swal('warning',"You need to login first", 'warning')
        }
    }

    addToCart = (id) => {

        if (this.props.username) {
            var newData = { username: this.props.username, product_id: id, quantity: 1 }
            Axios.post(urlApi + '/cart/add', newData)
                .then((res) => {
                    if (res.data.error) {
                        swal("Error", res.data.msg, "error")
                    } else {
                        this.props.countCart(this.props.username)
                       
                        
                            swal("Success", "Product has been added to cart", "success")
                        
                        
                    }
                })


        }
        else {
            swal("Warning!", "You need to login!", "warning")
            .then((willLogin) => {
                if (willLogin) {

                    this.props.history.push('/login');
                }
            });


        }
    }
//color:'#F26241'
    renderProdukJsx = () => {
        if (this.state.product.length > 0) {
            var jsx = this.state.product.map((val) => {
                return (

                    <div key={val.id} className="card col-md-3 mr-5 mt-3 border-card" >

                        <p className='border-brand'>
                            { val.w_id ?
                            <i style={{ left:'0',top:'15px', position:'absolute',color:'#F26241'}} className="fas fa-heart nav-link" id={`wishlist${val.id}`} onClick={()=>this.editWishlist(val.w_id, val.id)}></i>
                            :
                            <i style={{ left:'0',top:'15px', position:'absolute'}} className="far fa-heart nav-link" id={`wishlist${val.id}`} onClick={()=>this.editWishlist(val.w_id, val.id)}></i>

                        }
                            {val.brand_name}<i style={{ right:'0',top:'15px', position:'absolute'}} className="fas fa-cart-plus nav-link" onClick={()=>this.addToCart(val.id)} id={`addtocart${val.id}`} ></i></p>
                        <div onClick={() => this.toProdDetail(val.id)}>
                        {
                            val.stock === 0 ?
                                <div class="overlay-pict">
                                    <img title={val.name} className="card-img-top gambar-list" src={urlApi + '/' + val.product_image} alt="Card" />
                                    <div class="overlay-text">Out of Stock</div>
                                </div>
                                :

                                <img title={val.name} className="card-img-top gambar-list" src={urlApi + '/' + val.product_image} alt="Card" />

                        }



                        {
                            val.discount > 0 ?
                                <div className='discount-triangle'>
                                    <div className='discount'>{val.discount}%</div>
                                </div>
                                : null
                        }
                        <DynamicToolTip textTooltip={"Wishlist"} idTooltip={`wishlist${val.id}`}/>
                    
                        <DynamicToolTip textTooltip={"Add to cart"} idTooltip={`addtocart${val.id}`}/>
                        <div className="card-body">
                            <div>
                                <h4 style={{ fontSize: '17px', textAlign: 'center', height: 'auto' }}>{val.name}</h4></div>
                            <p style={{ fontWeight: '500', textAlign: 'center', paddingTop: '5px' }}><Currency quantity={val.price - (val.price * (val.discount / 100))} currency="IDR" /></p>
                        </div>
                        </div>
                    </div>
                )
            })

            return jsx
        } else {
            return (
                <div>
                    Product not found.
            </div>
            )
        }
    }

    componentDidMount() {
        this.setState({ product: this.props.product })
    }

    componentWillReceiveProps(newProps) {
        this.setState({ product: newProps.product })
    }


    render() {
        return (
            <div className='row' style={{ marginLeft: '40px', paddingBottom: '10px' }}>
                {this.renderProdukJsx()}
            </div>
        )
    }
}
const mapStateToProps=(state)=>{
    return {
        username : state.user.username
    }
}
export default withRouter(connect(mapStateToProps,{countCart, countWishlist})(ProductList))