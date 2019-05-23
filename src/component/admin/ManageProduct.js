import React from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact';
import Axios from 'axios'
import swal from 'sweetalert'
import { urlApi } from '../../support/urlApi'
import '../../support/css/manageProduct.css'
import { connect } from 'react-redux'
import PageNotFound from '../PageNotFound'

import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';

class ManageProduct extends React.Component {
    state = {
        brand: [], category: [], isEdit: false, editItem: null, selectedFileEdit: null,
        data: {
            columns: [

                {
                    label: 'No',
                    field: 'no',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Product',
                    field: 'name',
                    sort: 'asc',
                    width: 300
                },
                {
                    label: 'Brand',
                    field: 'brand_name',
                    sort: 'asc',
                    width: 300
                },
                {
                    label: 'Category',
                    field: 'category_name',
                    sort: 'asc',
                    width: 300
                },
                {
                    label: 'Price (Rp)',
                    field: 'price',
                    sort: 'asc',
                    width: 300
                },
                {
                    label: 'Discount (%)',
                    field: 'discount',
                    sort: 'asc',
                    width: 300
                },
                {
                    label: 'Stock',
                    field: 'stock',
                    sort: 'asc',
                    width: 300
                },
                {
                    label: 'Image',
                    field: 'product_image',
                    sort: 'disabled',
                    width: 300
                },
                {
                    label: 'Description',
                    field: 'description',
                    sort: 'disabled',
                    width: 300
                },
                {
                    label: 'Edit',
                    field: 'edit',
                    sort: 'disabled',
                    width: 20
                },
                {
                    label: 'Delete',
                    field: 'delete',
                    sort: 'disabled',
                    width: 20
                }
            ],
            rows: []
        }
    }

    componentDidMount() {
        this.getBrand()
        this.getCategory()
        this.getDataProduct()
    }

    getDataProduct = () => {
        Axios.get(urlApi + '/product/product-list')
            .then((res) => {
                if (res.data.error) {
                    swal("Error", res.data.msg, 'error')
                } else {
                    this.mapData(res.data)
                }
            })
            .catch((err) => console.log(err))

    }

    mapData = (data) => {
        var newData = { ...this.state.data }

        var dataBr = data.map((val, index) => {
            var link = urlApi + '/' + val.product_image

            return {
                no: index + 1,
                name: `${val.name}`,
                brand_name: `${val.brand_name}`,
                category_name: `${val.category_name}`,
                price: `${val.price}`,
                discount: `${val.discount} `,
                stock: `${val.stock}`,
                product_image: <img src={link} alt='product' className='manage-product-pict' />,
                description: `${val.description}`,

                edit: <input type='button' value='edit' className='btn btn-primary' onClick={() => this.editBtn(val)} />,
                delete: <input type='button' value='delete' className='btn btn-danger' onClick={() => this.deleteBtn(val.id)} />
            }
        })
        newData.rows = dataBr

        this.setState({ data: newData })
    }

    getBrand = () => {
        Axios.get(urlApi + '/brand/all')
            .then((res) => {
                if (res.data.error) {
                    swal("Error", res.data.msg, 'error')
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
                    swal("Error", res.data.msg, 'error')
                } else {
                    this.setState({ category: res.data })
                }
            })
            .catch((err) => console.log(err))
    }

    deleteBtn = (id) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this data!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    Axios.delete(urlApi + '/product/delete/' + id)
                        .then((res) => {
                            if (res.data.error) {
                                swal({
                                    text: res.data.msg,
                                    icon: "warning",
                                })
                            } else {
                                this.mapData(res.data)
                                swal("Data has been deleted!", {
                                    icon: "success",
                                });

                            }
                        })
                } else {
                    swal("Your data is safe!");
                }
            });

    }

    editBtn = (val) => {
        this.setState({ isEdit: true, editItem: val })
    }

    cancelBtn = () => {
        this.setState({ isEdit: false, editItem: null })
    }
    valueHandlerEdit = () => {
        var value = this.state.selectedFileEdit ? this.state.selectedFileEdit.name : 'Pick a pict'
        return value
    }

    onChangeHandlerEdit = (event) => {
        console.log(event.target.files[0])
        this.setState({ selectedFileEdit: event.target.files[0] })

    }
    printCategoryOption = () => {
        var data = this.state.category.map((val) => {
            if (val.id === this.state.editItem.category_id) {
                return (
                    <option value={val.id} selected>{val.category_name}</option>
                )

            }
            return (
                <option value={val.id}>{val.category_name}</option>
            )
        })
        return data
    }

    printBrandOption = () => {
        var data = this.state.brand.map((val) => {
            if (val.id === this.state.editItem.brand_id) {
                return (
                    <option value={val.id} selected>{val.brand_name}</option>
                )

            }
            return (
                <option value={val.id}>{val.brand_name}</option>
            )
        })
        return data
    }

    saveEdit = () => {
        var name = this.refs.editName.value ? this.refs.editName.value : this.state.editItem.name
        var brand_id = this.refs.editBrand.value ? this.refs.editBrand.value : this.state.editItem.brand_id
        var category_id = this.refs.editCategory.value ? this.refs.editCategory.value : this.state.editItem.category_id
        var price = this.refs.editPrice.value ? this.refs.editPrice.value : this.state.editItem.price
        var discount = this.refs.editDiscount.value ? this.refs.editDiscount.value : this.state.editItem.discount
        var stock = this.refs.editStock.value ? this.refs.editStock.value : this.state.editItem.stock
        var description = this.refs.editDescription.value ? this.refs.editDescription.value : this.state.editItem.description

        var newData = { name, brand_id, category_id, price, discount, stock, description }
        if (this.state.selectedFileEdit) {
            var fd = new FormData()
            fd.append('updateimage', this.state.selectedFileEdit)
            fd.append('newData', JSON.stringify(newData))
            fd.append('oldImage', this.state.editItem.product_image)
            Axios.put(urlApi + '/product/update/' + this.state.editItem.id, fd)
                .then((res) => {

                    if (res.data.error) {
                        swal("Error", res.data.msg, "error")
                    }
                    else {
                        swal("Success", "Product has been update", "success")
                        this.mapData(res.data)
                        this.setState({ isEdit: false, editItem: null, selectedFileEdit: null })
                    }

                })
                .catch((err) => console.log(err))
        } else {
            Axios.put(urlApi + '/product/update/' + this.state.editItem.id, newData)
                .then((res) => {
                    if (res.data.error) {
                        swal("Error", res.data.msg, "error")
                    }
                    else {
                        swal("Success", "Product has been update", "success")
                        this.mapData(res.data)
                        this.setState({ isEdit: false, editItem: null, selectedFileEdit: null })
                    }
                })
                .catch((err) => console.log(err))
        }
    }

    render() {
        if(this.props.role!=='admin'){
            return <PageNotFound/>
        }
        return (
            <div className="container" style={{ marginTop: '100px' }}>
                <h3>Manage Product</h3>
                <Link to='/add-product'>
                    <input type='button' className='tombol outline-none' value='ADD NEW PRODUCT' ></input>
                </Link>
                <div ></div>
                <MDBDataTable
                    striped
                    bordered
                    small
                    data={this.state.data}
                />
                {this.state.isEdit ?
                    <MDBModal isOpen={this.state.isEdit} toggle={this.cancelBtn} size='lg'>
                        <MDBModalHeader toggle={this.cancelBtn}>Edit Category {this.state.editItem.category_name}</MDBModalHeader>
                        <MDBModalBody>
                            
                            <div className='row'>
                                <div className='col-md-3'>
                                    <img src={'http://localhost:4000/' + this.state.editItem.product_image} width='100%' alt='product pic'></img>
                                    <input type='file' onChange={this.onChangeHandlerEdit} style={{ display: 'none' }} ref='inputEditPict' />
                                    <input type='button' value={this.valueHandlerEdit()} className='btn btn-success mt-2' style={{ width: '100%' }} onClick={() => { this.refs.inputEditPict.click() }}></input>
                                </div>
                                <div className='col-md-9'>
                                    <form>
                                        <div className="form-group">
                                            <label>Product Name </label><br></br>
                                            <input type='text' className='form-control' defaultValue={this.state.editItem.name} width='100%' ref='editName'></input>

                                        </div>
                                        <div className="form-group">
                                            <label>Brand</label><br></br>
                                            <select ref='editBrand'>
                                                {this.printBrandOption()}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Category</label><br></br>
                                            <select ref='editCategory'>
                                                {this.printCategoryOption()}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Price </label><br></br>
                                            <input type='number' className='form-control' defaultValue={this.state.editItem.price} width='100%' ref='editPrice'></input>

                                        </div>
                                        <div className="form-group">
                                            <label>Discount </label><br></br>
                                            <input type='number' className='form-control' defaultValue={this.state.editItem.discount} width='100%' ref='editDiscount'></input>

                                        </div>
                                        <div className="form-group">
                                            <label>Stock </label><br></br>
                                            <input type='number' className='form-control' defaultValue={this.state.editItem.stock} width='100%' ref='editStock'></input>

                                        </div>
                                        <div className="form-group">
                                            <label>Description </label><br></br>
                                            <textarea rows={6} className='form-control' defaultValue={this.state.editItem.description} width='100%' ref='editDescription'></textarea>

                                        </div>
                                    </form>
                                </div>
                            </div>


                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="primary" onClick={this.saveEdit}>Save changes</MDBBtn>
                            <MDBBtn color="secondary" onClick={this.cancelBtn}>Close</MDBBtn>

                        </MDBModalFooter>
                    </MDBModal>
                    : null
                }
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return {
        role : state.user.role
    }
}

export default connect(mapStateToProps)(ManageProduct)