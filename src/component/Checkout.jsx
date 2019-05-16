import React from 'react'
import Currency from 'react-currency-formatter';
import swal from 'sweetalert'
import { connect } from 'react-redux'
import Axios from 'axios';
import { urlApi } from '../support/urlApi';
import Swal2 from 'sweetalert2'
import { setTotalPayment, countCart } from '../1. action'
import { withRouter } from 'react-router-dom'

class Checkout extends React.Component {

    state = { category: '', productCart: [], getData: false, province: [], city: [], sub_district: [], urban: [], postal_code: '', idAddress: 0, bank: [], idBank: 0 }

    componentDidMount() {
        this.getDataCart()
        this.getProvince()
        this.getBank()
    }

    onBankChanged=(e)=> {
     
        this.setState({idBank: e.currentTarget.value});
      
      }
    getBank = () => {
        Axios.get(urlApi + '/transaction/bank')
            .then((res) => {
                if (res.data.error) {
                    Swal2.fire('Error!',
                        res.data.msg,
                        'error')
                } else {
                    
                    this.setState({ bank: res.data })
                }
            })
            .catch((err) => console.log(err))

    }
    getProvince = () => {
        Axios.get(urlApi + '/address/province')
            .then((res) => {
                if (res.data.error) {
                    Swal2.fire('Error!',
                        res.data.msg,
                        'error')
                } else {
                    this.setState({ province: res.data })
                }
            })
            .catch((err) => console.log(err))
    }

    provinceOption = () => {
        var data = this.state.province.map((val) => {
            return (
                <option value={val.province_code}>{val.province_name}</option>
            )
        })
        return data
    }

    getCity = () => {
        var province_code = this.refs.provinceInput.value
        // alert(province_code)
        Axios.get(urlApi + '/address/city/' + province_code)
            .then((res) => {
                if (res.data.error) {
                    Swal2.fire('Error!',
                        res.data.msg,
                        'error')
                } else {

                    this.setState({ city: res.data })
                }
            })
            .catch((err) => console.log(err))
    }
    cityOption = () => {
        var data = this.state.city.map((val) => {
            return (
                <option value={val.city}>{val.city}</option>
            )
        })
        return data
    }

    getSubDistrict = () => {
        var city = this.refs.cityInput.value
        Axios.get(urlApi + '/address/subdistrict/' + city)
            .then((res) => {
                if (res.data.error) {
                    Swal2.fire('Error!',
                        res.data.msg,
                        'error')
                } else {

                    this.setState({ sub_district: res.data })
                }
            })
            .catch((err) => console.log(err))
    }
    subOption = () => {
        var data = this.state.sub_district.map((val) => {
            return (
                <option value={val.sub_district}>{val.sub_district}</option>
            )
        })
        return data
    }

    getUrban = () => {
        var sub = this.refs.subInput.value
        Axios.get(urlApi + '/address/urban/' + sub)
            .then((res) => {
                if (res.data.error) {
                    Swal2.fire('Error!',
                        res.data.msg,
                        'error')
                } else {

                    this.setState({ urban: res.data })
                }
            })
            .catch((err) => console.log(err))
    }

    urbanOption = () => {
        var data = this.state.urban.map((val) => {
            return (
                <option value={val.urban}>{val.urban}</option>
            )
        })
        return data
    }
    getPostalCode = () => {
        var urban = this.refs.urbanInput.value
        var sub = this.refs.subInput.value
        Axios.get(urlApi + '/address/postalcode?urban=' + urban + '&sub=' + sub)
            .then((res) => {
                if (res.data.error) {
                    Swal2.fire('Error!',
                        res.data.msg,
                        'error')
                } else {

                    this.setState({ postal_code: res.data[0].postal_code, idAddress: res.data[0].id })
                }
            })
            .catch((err) => console.log(err))
    }
    checkoutBtn = () => {
        // alert('checkout')
        if (this.state.idAddress !== 0 && this.refs.inputAddress.value !== '' && this.state.idBank>0) {
            // alert('isi')


            Swal2.fire({
                title: 'Please wait',
                onOpen: () => {
                    Swal2.showLoading()
                }
            })

            Axios.post(urlApi + '/cart/checkout', { username: this.props.username, total: this.getTotal(), idAddress: this.state.idAddress, address: this.refs.inputAddress.value, payment_bank : this.state.idBank })
                .then((res) => {
                    if (res.data.error) {
                        Swal2.close()
                        swal("Error", res.data.msg, "error")
                    } else {
                        this.props.setTotalPayment(this.getTotal())
                        this.props.countCart(this.props.username)
                        Swal2.close()
                        this.props.countCart(this.props.username)
                        swal("Success", "Checkout success", "success")
                            .then((value) => {
                                this.props.history.push('/finishcheckout/' + res.data.id_order)
                            });



                    }
                })
                .catch((err) => console.log(err))

        } else {
            Swal2.fire('Warning!', 'Please fill all the form', "warning")

        }
    }


    getDataCart = () => {
        this.setState({ getData: false })
        Axios.get(urlApi + '/cart/data?username=' + this.props.username)
            .then((res) => {
                if (res.data.error) {
                    swal("Error", res.data.msg, "error")
                } else {
                    this.setState({ productCart: res.data, getData: true })
                }
            })
            .catch((err) => console.log(err))
    }
    renderCart = () => {
        var data = this.state.productCart.map((val) => {
            if (val.stock > 0) {
                return (
                    <tr>
                        <td>
                            <div className='row mb-auto mt-auto d-flex align-items-center'>
                                <div className='col-4' >
                                    <img src={urlApi + '/' + val.product_image} alt='product' style={{ width: '80px', height: '80px', display: 'inline' }} />
                                </div>
                                <div className='col-7' >
                                    <p style={{ fontStyle: 'bold' }}>{val.name}</p>

                                    <p>{val.quantity} x <span> <Currency quantity={val.price - (val.price * (val.discount / 100))} currency="IDR" /></span> </p>

                                </div>
                            </div>
                        </td>

                        <td >
                            <p style={{ float: "right" }} ><Currency quantity={val.quantity * (val.price - (val.price * (val.discount / 100)))} currency="IDR" /></p>
                        </td>


                    </tr>
                )

            }
        })
        return data
    }

    getTotal = () => {
        var total = 0

        for (var i = 0; i < this.state.productCart.length; i++) {
            var { discount, quantity, price } = this.state.productCart[i]
            total += (quantity * (price - (price * (discount / 100))))
        }
        return total
    }

    renderBank = () => {
        var data = this.state.bank.map((val) => {
            return (
                <tr>
                    <td><input type="radio" name="bank"
                        value={val.id}
                        checked={this.state.idBank == val.id}
                        onChange={this.onBankChanged} />
                        <label>
                        <div className='row' style={{ width: '600px', alignSelf: 'center', marginLeft:'10px' }}>
                            <div className="col-md-6">
                                <img src={val.bank_pict} style={{ width: '200px' }} />

                            </div>
                            <div className="col-md-6" style={{ alignItems: 'center' }}>
                               
                                <p>{val.account_name}</p>
                                <p style={{ marginTop: '-22px' }}>{val.account_number} </p>

                            </div>
                        </div>
                        </label>
                    
                    </td>

                </tr>

            )
        })

        return data
    }

    render() {
        return (
            <div className='container' style={{ marginTop: '80px' }}>
                <center>
                    <p className='navbar-brand'>CHECKOUT</p>
                </center>
                
                <div className="row">

                    {/* <label>Address</label><br></br>


                    <textarea type="textarea" rows={7} className="form-border outline-none" ref='inputAddress' /> */}
                    <div className="col-md-7">
                    <h5 style={{ marginLeft: '-20px'}}>BILLING DETAILS</h5>
                        <div className="row">
                            <label>Alamat (Jl, Blok, RT/RW)</label>

                            <textarea type="textarea" rows={3} className="form-border outline-none" ref='inputAddress' />

                        </div>
                        <div className="row">
                            <label>Provinsi</label>
                            <select className='form-control' ref='provinceInput' onChange={this.getCity}>
                                <option hidden>Select Province</option>
                                {this.provinceOption()}
                            </select>

                        </div>
                        <div className="row">
                            <label>Kabupaten/Kota</label>
                            <select className='form-control' ref='cityInput' onChange={this.getSubDistrict}>
                                <option hidden>Select City</option>
                                {this.cityOption()}
                            </select>

                        </div>
                        <div className="row">
                            <label>Kecamatan</label>
                            <select className='form-control' ref='subInput' onChange={this.getUrban}>
                                <option hidden>Select Sub District</option>
                                {this.subOption()}
                            </select>

                        </div>
                        <div className="row">
                            <label>Desa</label>
                            <select className='form-control' ref='urbanInput' onChange={this.getPostalCode}>
                                <option hidden>Select Urban</option>
                                {this.urbanOption()}
                            </select>

                        </div>
                        <div className="row align-items-center" style={{ marginTop: '10px' }}>
                            <label>Postal Code : </label>
                            {/* <p>{this.state.postal_code}</p> */}
                            <input type='text' className='form-control' readOnly style={{ width: '100px', marginLeft: '10px' }} value={this.state.postal_code}></input>
                        </div>

                        <h5 style={{ display: 'block', marginTop: '40px', marginLeft: '-20px' }}>PAYMENT METHOD</h5>
                        <p>Choose one bank to transfer the payment :</p>
                        <div className='row'>
                         <table className='table'>
                        <tbody>
                         {this.renderBank()}
                         </tbody>
                         <hr></hr>
                         </table>
                         </div>



                        <input type='button' style={{ float: "right" }} className='tombol' value='PLACE ORDER' onClick={this.checkoutBtn}></input>
                    </div>
                    <div className="col-md-5">
                        <h5>ORDER SUMMARY</h5>
                        <div className='container'>
                            <center>

                                <table className='table'>

                                    <thead>
                                        <td>Product</td>

                                        <td>Total</td>
                                    </thead>
                                    <tbody>

                                        {this.renderCart()}

                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td style={{ fontWeight: 'bold', verticalAlign: 'middle' }}>Total : </td>
                                            <td style={{ fontWeight: 'bold', textAlign: 'right' }}>
                                                <Currency quantity={this.getTotal()} currency="IDR" />



                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>


                            </center>
                        </div>
                    </div>

                </div>

                <div>

                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.user.username,
        cart: state.user.cart
    }
}
export default withRouter(connect(mapStateToProps, { setTotalPayment, countCart })(Checkout))