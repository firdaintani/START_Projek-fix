import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import headerProfile from '../support/img/header-profile.jpg'
import '../support/css/profile.css'
import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import Axios from 'axios';
import { urlApi } from '../support/urlApi';
import Swal from 'sweetalert2';
import emptyavatar from '../support/img/avatar-blank.png'
import swal from 'sweetalert';
import { getProfileImage } from '../1. action'
import Loader from 'react-loader-spinner'
import validator from 'validator';
import cookie from 'universal-cookie'

const objCookie = new cookie()
class Profile extends React.Component {
    state = { isOpen: false, user: {}, isEdit: false, getData: false }

    componentDidMount() {
        this.getData()
    }

    getData = () => {
        this.setState({ getData: false })
        Axios.get(urlApi + '/user/profile?user=' + this.props.username)
            .then((res) => {
                if (res.data.error) {
                    Swal.fire('error', res.data.msg, 'error')
                } else {
                    this.setState({ user: res.data[0], getData: true })
                }
            })
            .catch((err) => console.log(err))
    }

    cancelBtn = () => {
        this.setState({ isOpen: false })
    }

    valueHandlerEdit = () => {
        var value = this.state.selectedFileEdit ? this.state.selectedFileEdit.name : 'Pick a pict'
        return value
    }

    onChangeHandlerEdit = (event) => {
        console.log(event.target.files[0])
        this.setState({ selectedFileEdit: event.target.files[0] })

    }

    savePicture = () => {

        var fd = new FormData()
        fd.append('imageprofile', this.state.selectedFileEdit)
        if (this.props.profile_image) {
            fd.append('oldImage', this.props.profile_image)

        }
        Axios.put(urlApi + '/user/updatepicture?user=' + this.props.username, fd)
            .then((res) => {

                if (res.data.error) {
                    swal("Error", res.data.msg, "error")
                }
                else {
                    swal("Success", "Image profile has been updated", "success")
                    this.props.getProfileImage(this.props.username)
                    this.setState({ isOpen: false, selectedFileEdit: null })
                }

            })
            .catch((err) => console.log(err))

    }

    saveEdit = () => {


        if (this.refs.editUsername.value !== '' && this.refs.editName.value !== '' && this.refs.editPhone.value !== '' && this.refs.editEmail.value !== '') {
            var name = this.refs.editName.value
            var username = this.refs.editUsername.value
            var phone = this.refs.editPhone.value
            var email = this.refs.editEmail.value
            var oldEmail = this.refs.editEmail.value !== this.state.user.email ? this.state.user.email : null

            if (validator.isEmail(email)) {


                var data = { name, phone, username, email, oldEmail }
                Axios.put(urlApi + '/user/updateprofile?username=' + this.props.username, data)
                    .then((res) => {

                        if (res.data.sqlMessage.includes('email_UNIQUE')) {

                            swal("Error", "Email already registered. Try another email", "error")
                        }else if(res.data.sqlMessage.includes('PRIMARY')){
                            swal("Error", "Username already exist. Try another username", "error")

                        }
                        else {
                            this.setState({ getData: false })
                            objCookie.set('username', data.username)
                            swal("Success", "Profile has been updated", "success")
                            this.setState({ user: res.data[0], isEdit: false, getData: true })

                        }

                    })
                    .catch((err) => console.log(err))
            }else{
                
            swal('warning', 'Wrong email format', 'warning')
            }
        }
        else {
            swal('warning', 'Please fill the form', 'warning')


        }
    }


    render() {
        return (
            <div className="container" style={{ marginTop: '80px' }}>
                <div>
                    <img src={headerProfile} alt='header' className='header-profile'></img>
                </div>
                <div className='header-picture'>
                    <img src={this.props.profile_image ? `${urlApi}/${this.props.profile_image}` : emptyavatar} alt='header' className='header-profile-picture' />
                    <div className='overlay-picture'>
                        <div className="text-overlay-picture" onClick={() => { this.setState({ isOpen: true }) }}>
                            Change Profil Picture
                        </div>

                    </div>
                </div>
                <div style={{ backgroundColor: '#f9ffd9' }}>
                    <div >

                        <center>
                            <p className='navbar-brand mt-3'>USER PROFILE</p>

                        </center>

                        <div className="row">
                            <div className="col-md-3">
                                <div className="div" style={{ marginLeft: '35px' }}>
                                    <p className='menu-profile' onClick={() => this.setState({ isEdit: true })} >Edit Profile</p>
                                    <Link to='/changepassword'><p className='menu-profile'>Change Password</p></Link>

                                </div>
                            </div>
                            <div className="col-md-6">
                                {
                                    this.state.getData ?
                                        <form>
                                            <div className="form-group">
                                                <label style={{ fontWeight: 'bold' }}>Username</label><br></br>
                                                <input type="text" className="form-border outline-none" value={this.state.user.username} readOnly />
                                            </div>
                                            <div className="form-group">
                                                <label style={{ fontWeight: 'bold' }}>Full Name</label><br></br>
                                                <input type="text" className="form-border outline-none" value={this.state.user.name} readOnly />
                                            </div>
                                            <div className="form-group">
                                                <label style={{ fontWeight: 'bold' }}>Phone</label><br></br>
                                                <input type="text" className="form-border outline-none" value={this.state.user.phone} readOnly />
                                            </div>

                                            <div className="form-group">
                                                <label style={{ fontWeight: 'bold' }}>Email</label><br></br>
                                                <input type="text" className="form-border outline-none" value={this.state.user.email} readOnly />
                                            </div><br></br>
                                        </form>

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
                        </div>
                    </div>

                </div>
                <MDBModal isOpen={this.state.isOpen} toggle={this.cancelBtn} size='sm'>
                    <MDBModalHeader toggle={this.cancelBtn}>Edit Profile Picture </MDBModalHeader>
                    <MDBModalBody>

                        <input type='file' onChange={this.onChangeHandlerEdit} style={{ display: 'none' }} ref='inputEditPict' />
                        <input type='button' value={this.valueHandlerEdit()} className='btn btn-success mt-2' style={{ width: '100%' }} onClick={() => { this.refs.inputEditPict.click() }}></input>


                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="primary" onClick={this.savePicture}>Save changes</MDBBtn>
                        <MDBBtn color="secondary" onClick={this.cancelBtn}>Close</MDBBtn>

                    </MDBModalFooter>
                </MDBModal>

                <MDBModal isOpen={this.state.isEdit} toggle={() => this.setState({ isEdit: false })} size='md'>
                    <MDBModalHeader toggle={() => this.setState({ isEdit: false })}>Edit Profile </MDBModalHeader>
                    <MDBModalBody>
                        <form>
                            <div className="form-group">
                                <label>Username </label><br></br>
                                <input type='text' className='form-control' defaultValue={this.state.user.username} width='100%' ref='editUsername'></input>

                            </div>
                            <div className="form-group">
                                <label>Full Name </label><br></br>
                                <input type='text' className='form-control' defaultValue={this.state.user.name} width='100%' ref='editName'></input>

                            </div>
                            <div className="form-group">
                                <label>Phone </label><br></br>
                                <input type='number' className='form-control' defaultValue={this.state.user.phone} width='100%' ref='editPhone'></input>

                            </div>
                            <div className="form-group">
                                <label>Email </label><br></br>
                                <input type='text' className='form-control' defaultValue={this.state.user.email} width='100%' ref='editEmail'></input>

                            </div>

                        </form>

                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="primary" onClick={this.saveEdit}>Save changes</MDBBtn>
                        <MDBBtn color="secondary" onClick={() => this.setState({ isEdit: false })}>Close</MDBBtn>

                    </MDBModalFooter>
                </MDBModal>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.user.username,
        profile_image: state.user.profile_image
    }
}

export default connect(mapStateToProps, { getProfileImage })(Profile)