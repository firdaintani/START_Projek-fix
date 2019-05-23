import React from 'react';
import Loader from 'react-loader-spinner'

import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import queryString from 'query-string';
import Transaction from './Transaction'
import { connect } from 'react-redux'
import cookie from 'universal-cookie'
import PageNotFound from '../PageNotFound';
import Axios from 'axios';
import { urlApi } from '../../support/urlApi';
import Swal from 'sweetalert2';

const objCookie = new cookie()

class TabTransaction extends React.Component {
    state = { data: [], searchKey: '', activeTab: '1', onProcess: [], finished: [], canceled: [], haventPay: [], getData: false }
    toggle=(tab)=>{
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
    componentDidMount() {
        this.getTransaction()
    }

    getLink = () => {
        var params = queryString.parse(this.props.location.search);
        var newLink = '';
        if (params.m) {
            newLink = `/transaction/search?m=${params.m}`
        }
        return newLink
    }
    getTransaction = () => {
        var newLink = ''
        this.setState({ getData: false })
        if (this.props.location.search) {

            newLink = this.getLink()
            if (this.props.role === 'user') {
                newLink += `&u=${this.props.username}`
            }
        }
        else {
            newLink = `/transaction/all`
            if (this.props.role === 'user') {
                newLink += `?u=${this.props.username}`
            }

        }
        this.getDataTransaction(newLink)
    }

    getDataTransaction = (link) => {
        
        Axios.get(urlApi + link)
            .then((res) => {
                if (res.data.error) {
                    Swal.fire('Error', res.data.msg, "error")
                } else {
                    if (res.data.length > 0) {
                        
                        this.filterStatus(res.data)

                    } else {
                        this.setState({ finished: [], haventPay: [], onProcess: [], canceled: [], getData: true })
                    }
                }
            })
            .catch((err) => {
                console.log(err)
            })

    }
    filterStatus = (dataTransaction) => {
        var haventPay = dataTransaction.filter((val) => {
            return (val.status === 1)
        })
        var onProcess = dataTransaction.filter((val) => {
            return (val.status === 2)
        })
        var finished = dataTransaction.filter((val) => {
            return (val.status === 3)
        })
        var canceled = dataTransaction.filter((val) => {
            return (val.status === 4)
        })
        
        this.setState({ onProcess, haventPay, finished, canceled, getData: true })
    }

    pushUrl = () => {
        var newLink = `/transaction/search?m=${this.refs.selectMonth.value}`
        this.props.history.push(newLink)
        if (this.props.role === 'user') {
            newLink += `&u=${this.props.username}`
        }
        this.getDataTransaction(newLink)

    }

    filterBtn = () => {
        if (this.refs.selectMonth.value > 0)
            this.pushUrl()
        else {
            this.props.history.push('/transaction')
            var newLink = '/transaction/all'
            if (this.props.role === 'user') {
                newLink += `?u=${this.props.username}`
            }
            this.getDataTransaction(newLink)
        }

    }

    displayMonth = () => {
        return (
            <div className="col-md-2">

                <select className='form-control' ref='selectMonth'>
                    <option value={0} >All</option>
                    <option value={1}>January</option>
                    <option value={2}>February</option>
                    <option value={3}>March</option>
                    <option value={4}>April</option>
                    <option value={5}>May</option>
                    <option value={6}>June</option>
                    <option value={7}>July</option>
                    <option value={8}>August</option>
                    <option value={9}>September</option>
                    <option value={10}>October</option>
                    <option value={11}>November</option>
                    <option value={12}>December</option>

                </select>
            </div>
        )
    }
    render() {
        if (objCookie.get('username') === undefined) {
            return <PageNotFound />
        }
        return (
            <div className='container' style={{ marginTop: '80px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <p className='mt-3'>Filter by month :</p>
                    <div className="row">
                        {this.displayMonth()}
                        <div className="col-md-2">
                            <input type="button" className='tombol-black' value='FILTER' onClick={this.filterBtn} />
                        </div>
                    </div>

                </div>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.toggle('1'); }}
                        >
                            Not Yet Paid
            </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}
                        >
                            Being Processed
            </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '3' })}
                            onClick={() => { this.toggle('3'); }}
                        >
                            Finished
            </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '4' })}
                            onClick={() => { this.toggle('4'); }}
                        >
                            Failed
            </NavLink>
                    </NavItem>
                </Nav>
                {

                    this.state.getData ?


                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <Row>
                                    <Col sm="12">
                                        {/* {
                                            this.props.role === 'admin' ?
                                                <ManageTransaction data={this.state.haventPay} /> : this.props.role === 'user' ?
                                                    <Transaction data={this.state.haventPay} /> : null
                                        } */}
                                        <Transaction data={this.state.haventPay} />
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="2">
                                <Row>
                                    <Col sm="12">
                                        <Transaction data={this.state.onProcess} />

                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="3">
                                <Row>
                                    <Col sm="12">

                                        <Transaction data={this.state.finished} />

                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="4">
                                <Row>
                                    <Col sm="12">
                                        <Transaction data={this.state.canceled} />

                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                        :
                        <center>
                            <Loader
                                type="ThreeDots"
                                color="#000000"
                                height="300"
                                width="300"
                            />
                        </center>


                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.user.role,
        username: state.user.username
    }
}

export default connect(mapStateToProps)(TabTransaction)