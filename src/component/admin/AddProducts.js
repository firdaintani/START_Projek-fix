import React from 'react'
import Axios from 'axios'
import { urlApi } from '../../support/urlApi'
import swal from 'sweetalert'
import '../../support/css/addProduct.css'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PageNotFound from '../PageNotFound'

class AddProduct extends React.Component {
    state = { brand: [], category: [], selectedFile: null, error: '' }

    componentDidMount() {
        this.getBrand()
        this.getCategory()
    }

    onChangeHandler = (event) => {
        this.setState({ selectedFile: event.target.files[0] })

    }

    valueHandler = () => {

        var value = this.state.selectedFile ? this.state.selectedFile.name : 'PICK A PICTURE'
        return value
    }

    getBrand = () => {
        Axios.get(urlApi + '/brand/all')
            .then((res) => {
                if (res.data.error) {
                    swal.fire("Error", res.data.msg, 'error')
                } else {
                    this.setState({ brand: res.data })
                }
            })
            .catch((err) => console.log(err))
    }

    getCategory = () => {
        Axios.get(urlApi + '/category/all')
            .then((res) => {
                if (res.data.error) {
                    swal.fire("Error", res.data.msg, 'error')
                } else {
                    this.setState({ category: res.data })
                }
            })
            .catch((err) => console.log(err))
    }

    printCategoryOption = () => {
        var data = this.state.category.map((val) => {
            return (
                <option value={val.id} key={val.id}>{val.category_name}</option>
            )
        })
        return data
    }

    printBrandOption = () => {
        var data = this.state.brand.map((val) => {
            return (
                <option value={val.id} key={val.id}>{val.brand_name}</option>
            )
        })
        return data
    }

    addProduct = () => {
        var name = this.refs.inputName.value
        var brand_id = this.refs.inputBrand.value
        var category_id = this.refs.inputCategory.value
        var price = parseInt(this.refs.inputPrice.value)
        var discount = parseInt(this.refs.inputDiscount.value)
        var stock = parseInt(this.refs.inputStock.value)
        var description = this.refs.inputDesc.value

       
        if (name && brand_id && category_id && price && (discount>=0) && stock && description && this.state.selectedFile) {
            var data = { name, brand_id, category_id, price, discount, stock, description }

            var fd = new FormData()
            fd.append('product_image', this.state.selectedFile, this.state.selectedFile.name)
            fd.append('data', JSON.stringify(data))
            Axios.post('http://localhost:4000/product/add', fd)
                .then((res) => {
                  
                    if (res.data.error) {
                        swal("Error", res.data.msg, 'error')

                    }
                    else {
                       
                        swal("Success", "Product has been added", "success")
                        this.setState({ selectedFile: null })
                        this.props.history.push('/manage-product')
                    }

                })
                .catch((err) => console.log(err))
        } else {
            swal("Warning", "Please fill all the form", "warning")
        }
    }

    render() {
        if(this.props.role!=='admin'){
            return <PageNotFound/>
        }
        return (
            <div className="container" style={{ marginTop: '100px', marginBottom: '50px' }}>
                {/* ROW */}
                <Link to='/manage-product'><input type='button' style={{marginLeft:'-30px'}} className='tombol' value='BACK TO MANAGE PRODUCT'></input>
                </Link>
                <center>
                <div style={{ width: '55%'}}>
                    <div className="row row-padding">
                        <div className="col-md-3">
                            <label>Product Name</label>

                        </div>
                        <div className="col-md-9">
                            <input type="text" className="form-border outline-none" ref='inputName' />

                        </div>
                    </div>


                    <div className="row row-padding">
                        <div className="col-md-3">
                            <label>Select Brand</label>

                        </div>
                        <div className="col-md-9">
                            <select ref='inputBrand' style={{ width: '100%' }}>
                                {this.printBrandOption()}
                            </select>

                        </div>
                    </div>

                    <div className="row row-padding">
                        <div className="col-md-3">
                            <label>Select Category</label>

                        </div>
                        <div className="col-md-9">
                            <select ref='inputCategory' style={{ width: '100%' }}>
                                {this.printCategoryOption()}
                            </select>

                        </div>
                    </div>

                    <div className="row row-padding">
                        <div className="col-md-3">
                            <label>Price</label>

                        </div>
                        <div className="col-md-9">
                            <input type="number" className="form-border" ref='inputPrice' />

                        </div>
                    </div>

                    <div className="row row-padding">
                        <div className="col-md-3">
                            <label>Discount</label>

                        </div>
                        <div className="col-md-9">
                            <input type="number" className="form-border outline-none" ref='inputDiscount' />

                        </div>
                    </div>


                    <div className="row row-padding">
                        <div className="col-md-3">
                            <label>Stock</label>

                        </div>
                        <div className="col-md-9">
                            <input type="number" className="form-border outline-none" ref='inputStock' />

                        </div>
                    </div>

                    <div className="row row-padding">
                        <div className="col-md-3">
                            <label>Select Product Picture</label>

                        </div>
                        <div className="col-md-9">
                            <input type='file' ref='inputfile' style={{ display: 'none' }} onChange={this.onChangeHandler} />
                            <input type='button' className='btn btn-success' value={this.valueHandler()} style={{ width: '100%' }} onClick={() => this.refs.inputfile.click()} />

                        </div>
                    </div>

                    <div className="row row-padding">
                        <div className="col-md-3">
                            <label>Product Description</label>

                        </div>
                        <div className="col-md-9">
                            <textarea type="textarea" rows={7} className="form-border outline-none" ref='inputDesc' />

                        </div>
                    </div>

                    <input type="button" className="tombol" value='ADD PRODUCT' onClick={this.addProduct} style={{ width: '100%' }}></input><br></br>

                </div>
                </center>
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return {
        role : state.user.role
    }
}

export default withRouter(connect(mapStateToProps)(AddProduct))