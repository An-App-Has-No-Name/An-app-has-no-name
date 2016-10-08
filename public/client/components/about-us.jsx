import React, { Component }  from 'react';
import Header from './header';


export default class About extends Component {
  render(){

    return (
      <div>
      <Header />

      <h1>Trivardy Developers</h1>
      <div className='row'>
        <div className='col-xs-6 col-md-3'>
          <h3 className="names">Spencer B.</h3>
          <img src='../../assets/pictures/spencer-baird.jpeg' />
          <div className='caption'>
            <a href='https://github.com/spencerbaird36' target='_blank'><img className='logo' src='../../assets/pictures/github.png' /></a>
            <a href='https://www.linkedin.com/in/spencerbaird' target='_blank'><img className='logo' src='../../assets/pictures/linkedin.png' /></a>
          </div>
        </div>

        <div className='col-xs-6 col-md-3'>
          <h3 className="names">Thang T.</h3>
          <img src='../../assets/pictures/thang.jpeg' />
          <div className='caption'>
            <a href='https://github.com/tongthang0104' target='_blank'><img className='logo' src='../../assets/pictures/github.png' /></a>
            <a href='https://www.linkedin.com/in/thangtong' target='_blank'><img className='logo' src='../../assets/pictures/linkedin.png' /></a>
          </div>
        </div>

        <div className='col-xs-6 col-md-3'>
          <h3 className="names">Andrew M.</h3>
          <img src='../../assets/pictures/andrew.jpg' />
          <div className='caption'>
            <a href='https://github.com/AndrewjMeng' target='_blank'><img className='logo' src='../../assets/pictures/github.png' /></a>
            <a href='https://www.linkedin.com/in/andrewjmeng' target='_blank'><img className='logo' src='../../assets/pictures/linkedin.png' /></a>
          </div>
        </div>

        <div className='col-xs-6 col-md-3'>
          <h3 className="names">Mrinalini M.</h3>
          <img src='../../assets/pictures/mrinalini.jpeg' />
          <div className='caption'>
            <a href='https://github.com/mrinalini-m' target='_blank'><img className='logo' src='../../assets/pictures/github.png' /></a>
            <a href='https://www.linkedin.com/in/mrinalini-manandhar-a518b326' target='_blank'><img className='logo' src='../../assets/pictures/linkedin.png' /></a>
          </div>
        </div>
      </div>
      <div className='bottom-align-text'>
        <h4 className="names">Our GitHub Repository</h4>
        <a href="https://github.com/An-App-Has-No-Name/Trivardy" target="_blank"><img src="../../assets/pictures/github.png" /></a>
      </div>
    </div>
    );
  }
}
