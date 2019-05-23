import React from 'react'
import { MDBDataTable } from 'mdbreact';
import { Link } from 'react-router-dom'
import Currency from 'react-currency-formatter'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

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

    render() {
       
        return (
            <div className="container" style={{ marginTop: '20px' }}>
                {
                    this.state.data.rows.length === 0 ?
                        <h4>Transaction Empty</h4> :
                        <div>


                            <MDBDataTable
                                striped
                                bordered
                                small
                                data={this.state.data}

                            />
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