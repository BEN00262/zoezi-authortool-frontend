import React, {useContext} from 'react'
import { Button, Menu,Icon, Label } from 'semantic-ui-react';
import {Link, Redirect } from "react-router-dom";

import { PaperContext } from '../context/paperContext';
import AdminFavi from '../images/adminfavi.jpg';

const Navbar = () => {
    const { logoutDispatcher } = useContext(PaperContext);

    const signOut = () => {
        logoutDispatcher();
        return <Redirect to="/"/>
    }

    return (
      <Menu size='small' attached="top" style={{marginTop:"5px"}}>
        <Menu.Item header as={Link} to="/dashboard">
          <img src={AdminFavi} />
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item
            as={Link} to="/analytics"
            name="My Panel"
          />
          {/* <Menu.Item
              as={Link} to="/admin"
              name="Admin Panel"
            /> */}

          <Menu.Item as={Link} to='/notifications'>
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

export default Navbar;