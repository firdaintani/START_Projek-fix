import React from 'react'
import { MDBDataTable } from 'mdbreact';
import { Link } from 'react-router-dom'
import Currency from 'react-currency-formatter'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Axios from 'axios';
import { urlApi } from '../../support/urlApi';
import Swal from 'sweetalert2';

class Transaction extends React.Component {
    state = {
        searchKey: '',
        data: {
            columns: this.props.role==='admin' ?
            [
                {
                    label: 'No',
                    field: 'no',
                    sort: 'asc',
                    width: 100
                },

                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Username',
                    field: 'username',
                    sort: 'asc',
                    width: 100
                },

                {
                    label: 'Order Date',
                    field: 'order_date',
                    sort: 'asc',
                    width: 300
                },
                {
                    label: 'Payment Due',
                    field: 'payment_due',
                    sort: 'asc',
                    width: 300
                },


                {
                    label: 'Total',
                    field: 'total',
                    sort: 'asc',
                    width: 300
                },
                {
                    label: 'Detail',
                    field: 'detail',
                    sort: 'disabled',
                    width: 20
                }
            ] :
            [
                {
                    label: 'No',
                    field: 'no',
                    sort: 'asc',
                    width: 100
                },

                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Order Date',
                    field: 'order_date',
                    sort: 'asc',
                    width: 300
                },
                {
                    label: 'Payment Due',
                    field: 'payment_due',
                    sort: 'asc',
                    width: 300
                },


                {
                    label: 'Total',
                    field: 'total',
                    sort: 'asc',
                    width: 300
                },
                {
                    label: 'Detail',
                    field: 'detail',
                    sort: 'disabled',
                    width: 20
                }
            ],
            rows: []
        }
    }


    componentDidMount() {

        this.mapData(this.props.data)
    }
    componentWillReceiveProps(newProps) {
        this.mapData(newProps.data)
    }

    mapData = (data) => {
        var newData = { ...this.state.data }
        var dataBr = data.map((val, index) => {
            if(this.props.role==='admin'){
                return {
                    no : index+1,
                    id: val.id,
                    username: val.username,
                    order_date: `${val.order_date}`,
                    payment_due: `${val.payment_due}`,
                    total: <Currency quantity={val.total} currency="IDR" />,
                    detail: <Link to={'/transaction-detail/' + val.id}><input type='button' value='detail' className='btn btn-success' /></Link>
    
                }
    
            }
            return {
                no : index+1,
                id: val.id,
                order_date: `${val.order_date}`,
                payment_due: `${val.payment_due}`,
                total: <Currency quantity={val.total} currency="IDR" />,
                detail: <Link to={'/transaction-detail/' + val.id}><input type='button' value='detail' className='btn btn-success' /></Link>

            }
        })
        newData.rows = dataBr
        this.setState({ data: newData })

    }
    downloadFile=(text,filename)=>{
        var element = document.createElement('a');
        element.setAttribute('href', text);
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
    }
    
    downloadBtn=()=>{
        
        var dataTransaction = []
        for(var i =0;i<this.state.data.rows.length;i++){
            dataTransaction.push({...this.state.data.rows[i], no:(i+1)})
        }
        var objProperty = Object.keys(this.state.data.rows[0])
       
       
        var data = {title: this.props.title, dataTable : dataTransaction, tableTitle : objProperty}

        Axios.post(urlApi+'/transaction/getpdf', data)
        .then((res)=>{
            if(res.data.error){
                Swal.fire("error",res.data.msg,"error")
            }else{
                this.downloadFile(urlApi+res.data.path, `Daftar Transaksi ${this.props.title}.pdf`)
            }
        })
    }

    render() {
       
        return (
            <div className="container" style={{ marginTop: '20px' }}>
              
                {
                    this.state.data.rows.length === 0 ?
                        <h4>Transaction Empty</h4> :
                        <div>
                            {/*{
                                this.props.role==='admin' ?
                                <input type='button' className='tombol' value='DOWNLOAD PDF' onClick={this.downloadBtn} style={{float:'right', color:'black',marginBottom:'30px', cursor:'pointer'}}/>
                                : null
                            } */}
                            
                            {/* <div> */}
                            <MDBDataTable
                                striped
                                bordered
                                small
                                data={this.state.data}

                            />
                            {/* </div> */}
                        </div>

                }

                <p>{this.props.linkUrl}</p>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.user.role
    }
}

export default withRouter(connect(mapStateToProps)(Transaction))