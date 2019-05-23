import React from 'react';
import { MDBDataTable } from 'mdbreact';
import Axios from 'axios';
import {urlApi} from '../../support/urlApi'

import swal from 'sweetalert'
import { MDBBtn, MDBModal, MDBModalBody,MDBModalHeader, MDBModalFooter } from 'mdbreact';
import { connect } from 'react-redux'
import PageNotFound from '../PageNotFound'

class ManageBrand extends React.Component{
  
    
    state={dataSmtr:[], data : {
      columns: [
       
        {
          label : 'No',
          field:'no',
          sort : 'asc',
          width : 100
        },
        {
          label : 'Brand',
          field : 'brand_name',
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
    this.getBrand()
  }

  mapData=(data)=>{
    var newData = {...this.state.data}
    var dataBr = data.map((val, index)=>{
      return {
        no : index+1,
        brand_name : `${val.brand_name}`,
        edit : <input type='button' value='edit' className='btn btn-primary' onClick={()=>this.editBtn(val)}/>,
        delete : <input type='button' value='delete' className='btn btn-danger' onClick={()=>this.deleteBtn(val.id)}/>
      }
    })
    newData.rows=dataBr
    this.setState({data:newData})

  }
  
  getBrand=()=>{
    Axios.get(urlApi+'/brand/all')
    .then((res)=>{
      
      if(res.data.error){
        swal('Error',res.data.msg, 'error')
      }else{
        this.mapData(res.data)
      }
    })
    .catch((err)=>console.log(err))

  }

  saveEdit=()=>{
        
    var brand_name = this.refs.editBrand.value
    
    if(brand_name){
      Axios.put(urlApi+'/brand/update/'+this.state.editItem.id, {brand_name})
      .then((res)=>{
        if(res.data.error)
        {
          swal("Failed",res.data.msg, "error")
        }
        else{

          swal("Success!","Brand has been updated", "success");
          this.mapData(res.data)
          this.cancelBtn()

        }
      })
      .catch((err)=>console.log(err))

    }else{
      this.cancelBtn()
    }
  }

  editBtn=(val)=>{
   
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
        Axios.delete(urlApi+'/brand/delete/'+id)
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

  addBrand=()=>{
    var brand_name = this.refs.inputBrand.value
    if(brand_name===''){
      swal({
        text: "Must not empty!",
        icon: "warning",
      })
    }else{
      Axios.post(urlApi+'/brand/add', {brand_name})
      .then((res)=>{
        if(res.data.error){
          swal({
            text: res.data.msg,
            icon: "warning",
          })  
        }
        else{
          swal("Success!","Brand has been added", "success");
         this.mapData(res.data)
         this.refs.inputBrand.value=''
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
      <h3>Manage Brand</h3>
          <div className='row'>
            <div className='col-md-5'>
              <input type='text' placeholder='enter brand name' ref='inputBrand' className='form-border outline-none'></input>
            </div>
            <div className='col-md-4'>
              <input type='button' className='tombol outline-none' value='ADD' onClick={this.addBrand}></input>
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
      <MDBModalHeader toggle={this.cancelBtn}>Edit Brand {this.state.editItem.brand_name}</MDBModalHeader>
        <MDBModalBody>
          <input type='text' placeholder={this.state.editItem.brand_name} style={{width:'100%'}} ref='editBrand'/>
          
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

export default connect(mapStateToProps)(ManageBrand);