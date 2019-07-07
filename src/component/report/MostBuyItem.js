import React from 'react'
import Axios from 'axios';
import { urlApi } from '../../support/urlApi';
import Loader from 'react-loader-spinner'

class MostBuyItem extends React.Component{
    state={product : [],getData:false}
    componentDidMount(){
        this.getData()

    }

    getData=()=>{
        this.setState({getData:false})
        Axios.get(urlApi+'/report/mostbuyitem')
        .then((res)=>this.setState({product:res.data, getData:true}))
        .catch((err)=>console.log(err))

    }

    renderData=()=>{
        var data = this.state.product.map((val,index)=>{
            return(
                <tr key={index}>
                    <td style={{textAlign:'center'}}>{index+1}</td>
                    <td>{val.name}</td>
                    <td style={{textAlign:'center'}}>{val.total}</td>
                </tr>
            )
        })
        return data
    }

    render(){
        return(
            <div className='container' style={{marginTop:'20px'}}>
               { 
               this.state.getData?
               <center>
                    <table className='table' style={{width:'75%'}}>
                        <thead>
                            <tr style={{textAlign:'center'}}>
                                <th>No</th>
                                <th>Product Name</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderData()}
                        </tbody>

                    </table>
                </center>
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
        )
    }
}

export default MostBuyItem