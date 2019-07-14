import React from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import PageNotFound from './PageNotFound';
import {connect} from 'react-redux'
import classnames from 'classnames';
import MostBuyItem from './report/MostBuyItem'
import MostBuyUser from './report/MostBuyUser'
import SeringBuy from './report/SeringBuy'
class Report extends React.Component{
    state={ activeTab:'1'}

    toggle=(tab)=>{
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    


    render(){
        if (this.props.role !== 'admin') {
            return <PageNotFound />
        }
        return (
            <div className='container' style={{ marginTop: '80px' }}>
                  <center>
                    <div>
                        <p className='navbar-brand'>REPORT</p>      
                    </div>
                  </center>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.toggle('1'); }}
                        >
                            Items that are often purchased
            </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}
                        >
                           Users who buy the most
            </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '3' })}
                            onClick={() => { this.toggle('3'); }}
                        >
                            Users who often buy
            </NavLink>
                    </NavItem>
                </Nav>
                

                    


                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <Row>
                                    <Col sm="12">
                                       <MostBuyItem/>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="2">
                                <Row>
                                    <Col sm="12">
                                       <MostBuyUser/>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="3">
                                <Row>
                                    <Col sm="12">
                                        <SeringBuy/>
                                       
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                        
            


                
            </div>
        );

    }
}

const MapStateToProps=(state)=>{
    return{
        role : state.user.role
    }
}
export default connect(MapStateToProps)(Report)