import React from 'react'
import {Link} from 'react-router-dom'
import '../support/css/cart.css'
import Currency from 'react-currency-formatter';
import {connect} from 'react-redux'
import Axios from 'axios';
import { urlApi } from '../support/urlApi';
import {countCart} from '../1. action'
import swal from 'sweetalert2'
import Loader from 'react-loader-spinner'

class Cart extends React.Component{
    state ={category : '',selectedId:-1,qty:0, productCart:[], getData : false, stockItem : 0}
      
    componentDidMount(){
        this.getDataCart()
    }


    getDataCart=()=>{
        this.setState({getData: false})
        Axios.get(urlApi+'/cart/data?username='+this.props.username)
        .then((res)=>{
            if(res.data.error){
                swal.fire("Error", res.data.msg, "error")
            }else{
                this.setState({productCart : res.data, getData: true})
            }
        })
        .catch((err)=>console.log(err))
    }
    kurang=()=>{
        if(this.state.qty>1){
        
            this.setState({qty:this.state.qty-1})
        }
    }
    tambah=()=>{
      
         if(this.state.qty===this.state.stockItem){
            swal.fire("Warning", "Quantity must not over the stock", "warning")
        }else{
            this.setState({qty:this.state.qty+1})
            
        }
    }
    
    editBtn=(id, qty, stockItem)=>{
       
        this.setState({selectedId: id, qty:qty, stockItem: stockItem})
    }

    deleteBtn=(id)=>{
        swal.fire({
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
                Axios.delete(urlApi+'/cart/delete/'+id+'?username='+this.props.username)  
                .then((res)=>{
                    if(res.data.error){
                        swal.fire("Error", res.data.msg, "error")
                    }else{
                        this.setState({productCart: res.data})
                        this.props.countCart(this.props.username)

                        swal.fire(`Poof! Product has been deleted!`, {
                            icon: "success",
                          });
                         
                                    
                    }
                })      
            } else {
              swal.fire("Your product is safe!");
            }
          });
     
    }

    saveEdit=(id, qty, when)=>{
        Axios.put(urlApi+'/cart/edit/'+id, {quantity : qty, username : this.props.username})
        .then((res)=>{
            if(res.data.error){
                swal.fire("Error", res.data.msg,"error")
            }
            else{

                this.setState({productCart: res.data})
                if(when==='editQtyCart'){

                
                swal.fire("Success", "Update success", "success")
                this.cancelBtn()
            }
            }
        })
    }

    cancelBtn=()=>{
        this.setState({selectedId:-1})
    }

    renderCart =()=>{
        var data = this.state.productCart.map((val)=>{
            if(val.stock < val.quantity ){
                this.saveEdit(val.id, val.stock)
            }
            else if(val.stock > 0) {
                
                return (
                    <tr key={val.id}>
                    <td>
                        <div className='row mb-auto mt-auto d-flex align-items-center'>
                            <div className='col-4' >
                                <img src={urlApi+'/'+val.product_image} style={{cursor:'pointer'}} alt='product'className='product-picture-cart' onClick={()=>this.props.history.push('/product-detail/'+val.product_id)}/>
                            </div>
                            <div className='col-7' >
                                <p style={{fontStyle:'bold', fontSize:'20px', cursor:'pointer'}} onClick={()=>this.props.history.push(`/product-detail/${val.product_id}`)}>{val.name}</p>
    
                                {
                                    this.state.selectedId===val.id ? 
                                    <div>
                                    <div className='row'>
                                    <div className='col-3'>
                                        <i className="fas fa-minus" onClick={this.kurang} style={{cursor:'pointer'}}></i>
                                    </div>
                                    <div className='col-2' style={{textAlign:"center",marginLeft:'-50px'}} >
                                        <span>{this.state.qty}</span>
        
                                    </div>
                                    <div className='col-7'>
                                        <i className="fas fa-plus" onClick={this.tambah} style={{cursor:'pointer', marginRight:'10px'}}></i>
                                        x <Currency quantity={val.price-(val.price*(val.discount/100))} currency="IDR"/>
                                    </div>
                                    
                                    </div>
                                    <div className='row'>
                                    <div className='col'>
                                    Available stock : {val.stock}
                                    </div>
                                    </div>
                                    </div>
                                    
                                    : 
                                    <div>
                                    <p>{val.quantity} x <span> <Currency quantity={val.price-(val.price*(val.discount/100))} currency="IDR"/></span> </p>
                                    Available stock : {val.stock}
                                   
                                    </div>
                                }                        
                               
                            </div>
                        </div>
                    </td>
                    {
                        this.state.selectedId===val.id ?
                        <td >
                            <p>
                            <span className='save-button' onClick={()=>this.saveEdit(val.id, this.state.qty, 'editQtyCart')}>Save</span><span className='cancel-button' onClick={this.cancelBtn}>Cancel</span>
                            </p>
                            <p style={{float:"right"}} ><Currency quantity={val.quantity*(val.price-(val.price*(val.discount/100)))} currency="IDR"/></p>
                        </td>
                                
                        : <td >
                        <p className='edit-button' onClick={()=>this.editBtn(val.id, val.quantity, val.stock)}>Edit</p>
                        <p style={{float:"right"}} ><Currency quantity={val.quantity*(val.price-(val.price*(val.discount/100)))} currency="IDR"/><i className="fas fa-times" style={{paddingLeft:'20px', cursor:'pointer'}} onClick={()=>this.deleteBtn(val.id)}></i></p>
                        </td>
        
                    }
                </tr>
                )
    
            }
            return (
                <tr>
                    <td>
                        <div className='row mb-auto mt-auto d-flex align-items-center'>
                            <div className='col-4 overlay-pict-cart' >
                                <img src={urlApi+'/'+val.product_image} alt='product' className='product-picture-cart'/>
                                <div className="overlay-text">Out of stock</div>
                            </div>
                            <div className='col-7' >
                                <p style={{fontStyle:'bold', fontSize:'20px'}}>{val.name}</p>
                                <p>{val.quantity} x <span> <Currency quantity={val.price-(val.price*(val.discount/100))} currency="IDR"/></span> </p>
                            
                                                       
                               
                            </div>
                           

                        </div>
                    </td>
                    <td>
                    <p style={{float:"right"}}><Currency quantity={val.quantity*(val.price-(val.price*(val.discount/100)))} currency="IDR"/><i className="fas fa-times" style={{paddingLeft:'20px', cursor:'pointer'}} onClick={()=>this.deleteBtn(val.id)}></i></p>

                    </td>
                    
                    
                </tr>
            )
        })
        return data
    }

    getTotal=()=>{
        var total=0
      
        for(var i=0;i<this.state.productCart.length;i++){
            var {discount, quantity, price} = this.state.productCart[i]
            total+=(quantity*(price-(price*(discount/100))))
        }
        return total
    }
    render(){
        if(this.state.getData===false){
           return( <div>
            <center>
                <Loader
                    type="ThreeDots"
                    color="#000000"
                    height="300"
                    width="300"
                />
            </center>
        </div>)

        }
        return(
            <div className='container' style={{marginTop:'70px',paddingTop:'40px'}}>
            <center>
                   { this.props.cart===0 ?
                    <table className='table' style={{width:'900px'}}>
                <thead>
                    <tr>
                    <th style={{fontSize:'24px'}}>CART IS EMPTY</th>
                       
                    <th><Link to='/product/all'><input type='button' className='tombol' value='CONTINUE SHOPPING' style={{float:'right'}}></input></Link></th>
                    </tr>
               </thead>
               </table>
                    :
                   <table className='table' style={{width:'900px'}}>
               
                     <thead>
                         <tr>
                        <th style={{fontSize:'24px'}}>CART</th>
                       
                        <th><Link to='/product/all'><input type='button' className='tombol' value='CONTINUE SHOPPING' style={{float:'right'}}></input></Link></th>
                        </tr>
                    </thead>
                    <tbody>

                        {this.renderCart()}
                    
                    </tbody> 
                    <tfoot>
                        <tr>
                            <td style={{fontWeight:'bold', verticalAlign:'middle'}}>Total : </td>
                            <td style={{fontWeight:'bold'}}>
                            <div className='row d-flex align-items-center'>
                            <div className='col-5'>
                                    <Currency quantity={this.getTotal()} currency="IDR"/>

                                </div>
                                <div className='col-5'>
                                   <Link to='/checkout'><input type='button' style={{float:"left"}} className='tombol' value='CHECKOUT' onClick={this.checkoutBtn}></input>
                                   </Link> 
                                </div>

                            </div>
                            
                            
                            </td>
                        </tr>
                    </tfoot>
                    </table>

               }
               
               </center>
            </div>
        )
    }
}


const mapStateToProps=(state)=>{
    return {
        username : state.user.username,
        cart : state.user.cart
    }
}
export default connect(mapStateToProps,{countCart})(Cart)