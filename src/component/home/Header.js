import React from 'react';
import gambar from '../../support/img/img-header.jpg'
import '../../support/css/header.css'
import SliderCategory from './SliderCategory.js'
import SliderProductDiscount from './SliderProductDiscount'
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import {Link} from 'react-router-dom'
import SliderNewArrival from './sliderNewArrival.js'
import Contact from './Contact.js';
import About from './About.js'
class Header extends React.Component{
   
    render(){
        return (
            <div className='container'>
                <div className='row' style={{margin:'70px', paddingTop:'20px'}}>
                    <div className='col-6 mt-auto mb-auto'>
                        <div className='header-text'>ST-ART</div>
                        <div className='header-text'>WELCOMES</div>
                        <div className='header-text'>YOU</div>
                        <div>Your trusted art supplies</div>

                        <div>
                            <Link to='/product/all'><input type='button' className='tombol' value='SHOP NOW' style={{marginTop:'10px'}}></input>
                            </Link></div>
                    </div>
                    <div className='col-6'>
                        <div className="card" style={{width: '100%'}}>
                        <img className="card-img-top" src={gambar} alt="Card cap" />
                        
                    </div>
                    </div>
                </div>
                <hr className="garis"></hr>
                <center><h3 className='navbar-brand' style={{marginTop:'30px'}}>NEW ARRIVAL</h3></center>
                <SliderNewArrival/>
                
                <hr className="garis"></hr>
                <center><h3 className='navbar-brand' style={{marginTop:'30px'}}>DISCOUNT</h3></center>
                <SliderProductDiscount/>
                
                <hr className="garis"></hr>
                <center><h3 className='navbar-brand' style={{marginTop:'30px'}}>CATEGORIES</h3></center>
                <SliderCategory/>
                <hr className="garis"></hr>
                <center><h3 className='navbar-brand' style={{marginTop:'30px'}}>ABOUT</h3></center>
                <About/>
                <hr className="garis"></hr>
                <Contact/>
                <hr className="garis"></hr>
                
            </div>
            
        )
    }
}
export default Header