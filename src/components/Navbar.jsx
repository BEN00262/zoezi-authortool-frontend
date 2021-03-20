import React, {useContext} from 'react'
import { Button, Menu } from 'semantic-ui-react';
import {Redirect} from "react-router-dom";

import { PaperContext } from '../context/paperContext';

const Navbar = () => {
    const { logoutDispatcher } = useContext(PaperContext);

    const signOut = () => {
        logoutDispatcher();
        return <Redirect to="/"/>
    }

    return (
      <Menu size='small' style={{marginTop:"5px"}}>
        <Menu.Menu position='right'>
          <Menu.Item>
            <Button primary onClick={signOut}>Sign Out</Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
}

export default Navbar;