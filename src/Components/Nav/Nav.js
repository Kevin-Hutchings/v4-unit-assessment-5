import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateUser, logout } from '../../redux/reducer';
import homeLogo from './../../assets/home_logo.png';
import newLogo from './../../assets/new_logo.png';
import logoutLogo from './../../assets/shut_down.png';
import './Nav.css';

class Nav extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  componentDidMount() {
    this.getUser()
  }

  getUser() {
    axios.get('/api/auth/me')
    .then(res => this.props.updateUser(res.data))
  }
  
  logout() {
    axios.post('/api/auth/logout')
      .then(_ => this.props.logout())
  }
  
  render() {
      return this.props.location.pathname !== '/' &&
        <div className='nav'>
          <div className='nav-profile-container'>
            <div className='nav-profile-pic' style={{backgroundImage: `url('${this.props.profilePic}')`}}></div>
            <p>{this.props.username}</p>
          </div>
          <div className='nav-links'>
            <Link to='/dash'>
              <img className='nav-img' src={homeLogo} alt='home' />
            </Link>
            <Link to='/form'>
              <img className='nav-img' src={newLogo} alt='new post' />
            </Link>
          </div>
          <Link to='/'>
            <img onClick={this.logout} className='nav-img logout' src={logoutLogo} alt='logout' />
          </Link>
        </div>
  }
}

const mapStateToProps = (state) => {
  return{
    username: state.username,
    profilePic: state.profilePic
  }
}

const mapDispatchToProps = {
  updateUser,
  logout
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Nav));