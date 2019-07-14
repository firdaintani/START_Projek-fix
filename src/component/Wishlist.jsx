import React from 'react'
import Axios from 'axios';
import { urlApi } from '../support/urlApi';
import Swal from 'sweetalert2';
import Currency from 'react-currency-formatter'
import {connect} from 'react-redux'

import Loader from 'react-loader-spinner'
// import swal from 'sweetalert'
import {countWishlist} from './../1. action'

class Wishlist extends React.Component{
    state={wishlist:[], getData : false}

    componentDidMount(){
        this.getWishlist()
    }

    toProdDetail = (id) => {
        // alert(id)
        this.props.history.push('/product-detail/' + id);
    }
    
    getWishlist=()=>{
        this.setState({getData:false})
        Axios.get(urlApi+'/wishlist/all/'+this.props.username)
        .then((res)=>{
            if(res.data.error){
                Swal.fire('error',res.data.msg,'error')
            }else{
                this.setState({wishlist:res.data, getData:true})
            }
        })
        .catch((err)=>console.log(err))
    }
    deleteWishlist=(id)=>{
        Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this product data!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          })
          .then((willDelete) => {
     
            if (willDelete.value) {
                Axios.delete(urlApi+'/wishlist/delete/'+id)
                .then((res)=>{
                    if(res.data.error){
                        Swal.fire('error',res.data.msg,'error')
                    }else{
                        Swal.fire('success',res.data, 'success')
                        this.getWishlist()
                        this.props.countWishlist(this.props.username)
                    }
                })
                .catch((err)=>console.log(err))
        } else {
              Swal.fire("Your product is safe!");
            }
          });
     
       
    }

    renderWishlistProduct=()=>{
        var data = this.state.wishlist.map((val)=>{
         
            return (
                <div key={val.id} className="card col-md-3 mr-5 mt-3 border-card" >
                <p className='border-brand'>{val.brand_name}<i style={{ right:'0',top:'15px', position:'absolute'}} className="fas fa-times nav-link" onClick={()=>this.deleteWishlist(val.id)}></i></p>
                <div onClick={() => this.toProdDetail(val.product_id)}>
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

                <div className="card-body">
                    <div>
                        <h4 style={{ fontSize: '17px', textAlign: 'center', height: 'auto' }} >{val.name}</h4></div>
                    <p style={{ fontWeight: '500', textAlign: 'center', paddingTop: '5px' }}><Currency quantity={val.price - (val.price * (val.discount / 100))} currency="IDR" /></p>
                </div>
                </div>
            </div>
            )
        })
        return data
    }

    searchProduct=()=>{
        var searchkey = this.refs.search.value

        Axios.get(urlApi+'/wishlist/search?s='+searchkey+'&u='+this.props.username)
        .then((res)=>{
            if(res.data.error){
                Swal.fire('error',res.data.msg,'error')
            }else{
                this.setState({wishlist:res.data})
            }
        })
        .catch((err)=>console.log(err))
    }

    render(){
        return(
            <div className="container" style={{marginTop:'80px'}}>
                <input className='form-control outline-none'  placeholder='Search product wishlist' ref='search' onChange={this.searchProduct}/>
                 {
                     this.state.getData ?
                 
                     <div className='row justify-content-center'>
                     {
                         this.state.wishlist.length > 0 ?
                         this.renderWishlistProduct()
                         : <p>Wishlist empty</p>
                     }

                 </div>
                 :
                 <div>
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
                 
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return {
        username : state.user.username
    }
}

export default connect(mapStateToProps, {countWishlist})(Wishlist)