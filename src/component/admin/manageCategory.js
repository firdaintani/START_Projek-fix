import React from 'react';
import { MDBDataTable } from 'mdbreact';
import Axios from 'axios';
import {urlApi} from '../../support/urlApi'

import swal from 'sweetalert'
import { MDBBtn, MDBModal, MDBModalBody,MDBModalHeader, MDBModalFooter } from 'mdbreact';
import {connect} from 'react-redux'
import PageNotFound from '../PageNotFound'

class ManageCat extends React.Component{
  
    
    state={selectedFile: null,selectedFileEdit: null, data : {
      columns: [
       
        {
          label : 'No',
          field:'no',
          sort : 'asc',
          width : 100
        },
        {
          label : 'Category',
          field : 'category_name',
          sort : 'asc',
          width : 300
        }, 
        {
          label : 'Pict',
          field : 'category_picture',
          sort : 'asc',
          width : 300
        }, 
        {
          label : 'Edit',
          field : 'edit',
          sort : 'disabled',
          width:20
        },
        {
          label : 'Delete',
          field : 'delete',
          sort : 'disabled',
          width:20
        }
      ],
      rows: []
  }, isEdit: false,
  editItem : null
  
  }
  
    
  componentDidMount(){
    this.getCategory()
  }

  onChangeHandler = (event) => {
    console.log(event.target.files[0])
    this.setState({ selectedFile: event.target.files[0] })

  }

  valueHandler = () => {

      var value = this.state.selectedFile ? this.state.selectedFile.name : 'PICK A PICTURE'
      return value
  }
  
  mapData=(data)=>{
    var newData = {...this.state.data}
   
    var dataBr = data.map((val, index)=>{
      return {
        no : index+1,
        category_name : `${val.category_name}`,
        product_image: <img src={urlApi+'/'+val.category_picture} alt='category' className='manage-product-pict' />,
               
        edit : <input type='button' value='edit' className='btn btn-primary' onClick={()=>this.editBtn(val)}/>,
        delete : <input type='button' value='delete' className='btn btn-danger' onClick={()=>this.deleteBtn(val.id)}/>
      }
    })
    newData.rows=dataBr
    
    this.setState({data:newData})

  }
  
  getCategory=()=>{
    Axios.get(urlApi+'/category/all')
    .then((res)=>{
      if(res.data.error){
        swal("Error",res.data.msg,'error')
      }else{
        this.mapData(res.data)
      }
    })
    .catch((err)=>console.log(err))
  }
  valueHandlerEdit = () => {
    // return this.state.selectedFile.
    var value = this.state.selectedFileEdit ? this.state.selectedFileEdit.name : 'Pick a pict'
    return value
  }

  onChangeHandlerEdit = (event) => {
      console.log(event.target.files[0])
      this.setState({ selectedFileEdit: event.target.files[0] })

  }

  saveEdit=()=>{
    var category_name = this.refs.editCategory.value ? this.refs.editCategory.value : this.state.editItem.category_name

    if (this.state.selectedFileEdit) {
      var fd = new FormData()
      fd.append('newImage', this.state.selectedFileEdit,this.state.selectedFileEdit.name)
      fd.append('newData', JSON.stringify({category_name}))
      fd.append('oldImage', this.state.editItem.category_picture)
      Axios.put(urlApi + '/category/update/' + this.state.editItem.id, fd)
          .then((res) => {

              if (res.data.error) {
                  swal("Error", res.data.msg, "error")
              }
              else {
                  swal("Success", "Category has been updated", "success")
                  this.mapData(res.data)
                  this.setState({ isEdit: false, editItem: null, selectedFileEdit: null })
                  
                 
              }

          })
          .catch((err) => console.log(err))
  }else{
    // if(category_name){
      Axios.put(urlApi+'/category/update/'+this.state.editItem.id, {category_name})
      .then((res)=>{
        if(res.data.error)
        {
          swal("Failed",res.data.msg, "error")

        }
        else{
          this.cancelBtn()
          // alert('masuk')
          swal("Success!","Product has been updated", "success");
          this.mapData(res.data)
         

        }
      })
      .catch((err)=>console.log(err))

    // }else{
    //   this.cancelBtn()
    // }
  }
}
  editBtn=(val)=>{
    // alert(val.category_name)
    this.setState({isEdit:true,editItem:val})
  }

  cancelBtn=()=>{
    this.setState({isEdit:false, editItem:null})
  }

  deleteBtn=(id)=>{
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        Axios.delete(urlApi+'/category/delete/'+id)
        .then((res)=>{
          if(res.data.error){
            swal({
              text: res.data.msg,
              icon: "warning",
            })  
          }else{
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

  addCategory=()=>{
    var category_name = this.refs.inputCategory.value
    if(category_name==='' || this.state.selectedFile===null){
      swal({
        text: "Must not empty!",
        icon: "warning",
      })
    }else{
          
      var fd = new FormData()
      fd.append('category_image', this.state.selectedFile, this.state.selectedFile.name)
      fd.append('data', JSON.stringify({category_name}))
      
      Axios.post(urlApi+'/category/add', fd)
      .then((res)=>{
        if(res.data.error){
          swal({
            text: res.data.msg,
            icon: "warning",
          })  
        }
        else{
          swal("Success!","Product has been added", "success");
          this.mapData(res.data)
          this.refs.inputCategory.value=''
          this.setState({selectedFile : null})
        }
      })
    }
  }


  render(){
    if(this.props.role!=='admin'){
      return <PageNotFound/>
  }
  return (
      <div className='container' style={{marginTop:'100px'}}>
      {/* {this.state.data.rows.id} */}
      <h3>Manage Category</h3>
          <div className='row'>
            <div className='col-md-5'>
              <input type='text' placeholder='enter category' ref='inputCategory' className='form-border outline-none'></input>
            </div>
           <div className='col-md-3'>
             <input type='file' ref='inputfile' style={{ display: 'none' }} onChange={this.onChangeHandler} />
             <input type='button' className='tombol' value={this.valueHandler()} style={{ width: '100%' }} onClick={() => this.refs.inputfile.click()} />

           </div>
            <div className='col-md-4'>
              <input type='button' className='tombol outline-none' value='ADD' onClick={this.addCategory}></input>
            </div>

          </div>
      <div ></div>
      <MDBDataTable
        striped
        bordered
        small
        data={this.state.data}
      />

        { this.state.isEdit?    
      <MDBModal isOpen={this.state.isEdit} toggle={this.cancelBtn}>
      <MDBModalHeader toggle={this.cancelBtn}>Edit Category {this.state.editItem.category_name}</MDBModalHeader>
        <MDBModalBody>
          <div className='row'>
            <div className='col-md-7'>
               <input type='text' placeholder={this.state.editItem.category_name} style={{width:'100%'}} ref='editCategory'/>
        
            </div>
            <div className='col-md-5'>
                <img src={urlApi +'/'+ this.state.editItem.category_picture} width='100%' alt='product pic'></img>
                <input type='file' onChange={this.onChangeHandlerEdit} style={{ display: 'none' }} ref='inputEditPict' />
                <input type='button' value={this.valueHandlerEdit()} className='btn btn-success mt-2' style={{ width: '100%' }} onClick={() => { this.refs.inputEditPict.click() }}></input>
            </div>
          </div>
          
          
          
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="primary"  onClick={this.saveEdit}>Save changes</MDBBtn>
          <MDBBtn color="secondary" onClick={this.cancelBtn}>Close</MDBBtn>
     
        </MDBModalFooter>
        </MDBModal>
     :null 
    }
      </div>

    );
      
    }

 
}

const mapStateToProps=(state)=>{
  return {
      role : state.user.role
  }
}

export default connect(mapStateToProps)(ManageCat);