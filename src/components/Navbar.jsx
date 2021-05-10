import React, {useContext} from 'react'
import { Button, Menu,Icon, Label } from 'semantic-ui-react';
import {Redirect, withRouter } from "react-router-dom";

import { PaperContext } from '../context/paperContext';
import AdminFavi from '../images/adminfavi.jpg';

const Navbar = (props) => {
    const { logoutDispatcher } = useContext(PaperContext);

    const signOut = () => {
        logoutDispatcher();
        return <Redirect to="/"/>
    }

    const navigateHome = () => props.history.push('/dashboard');
    const navigateNotifications = () => props.history.push('/notifications');
    const navigateToAnalytics = () => props.history.push('/analytics')

    return (
      <Menu size='small' attached="top" style={{marginTop:"5px"}}>
        <Menu.Item header onClick={navigateHome}>
          <img src={AdminFavi} />
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item
            name="My Panel"
            onClick={navigateToAnalytics}
          />
          <Menu.Item onClick={navigateNotifications}>
            <Icon name='bell' /> Notifications
            <Label color='teal'>
              22
            </Label>
          </Menu.Item>
          <Menu.Item>
            <Button primary onClick={signOut}>Sign Out</Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
}

export default withRouter(Navbar);