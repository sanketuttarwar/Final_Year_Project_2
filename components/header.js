import React, { Component } from 'react';
import {Container, Menu } from 'semantic-ui-react';
import { Link } from "../routes";

class Header extends Component {
 
  state = {activeItem:''}
  
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  
  render() {
    const { activeItem } = this.state
    const background = {
      backgroundColor: '#35016f',
      border:'0px'
    }
    const cont = {
      minHeight:'50px',
      border:'0px'
    }
    const bord = {
      backgroundColor: '#35016f',
      minHeight:'50px',
      border:'0px',
      paddingBottom:'8px'
    }
    return (
      <div style={background} >
        <Menu stackable inverted  top large pointing secondary style={bord} fixed={'top'}>
          <Container inverted  style={cont} >
            <Menu.Item
              name='Home'
              active={activeItem === 'Home'}
              onClick={this.handleItemClick}
              href="/"
            >
              Home
            </Menu.Item>
            <Menu.Item
              name='DoctorPage'
              active={activeItem === 'DoctorPage'}
              onClick={this.handleItemClick}
              href="/DoctorPage"
            >
              Doctor
            </Menu.Item>
            <Menu.Item
              name='Patient'
              active={activeItem === 'Patient'}
              onClick={this.handleItemClick}
              href="/PatientHomePage"
            >
              Patient
            </Menu.Item>
            <Menu.Item
              name='InsuranceOwner'
              active={activeItem === 'InsuranceOwner'}
              onClick={this.handleItemClick}
              href="/OwnerHomePage"
            >
              Insurance Admin
            </Menu.Item>
          </Container>
        </Menu>
      </div>
    )
  }
}

export default Header;