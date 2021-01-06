import React, { useState } from 'react'
import { Icon, Menu } from 'semantic-ui-react'

const SideMenu = () => {
    const [activeItem,setActiveItem] = useState('gamepad');

    const handleItemClick = (e,{name}) => {
        setActiveItem(name);
    }    
    return (
        <Menu icon vertical>
          <Menu.Item
            name='gamepad'
            active={activeItem === 'gamepad'}
            onClick={handleItemClick}
          >
            <Icon name='gamepad' />
          </Menu.Item>
  
          <Menu.Item
            name='video camera'
            active={activeItem === 'video camera'}
            onClick={handleItemClick}
          >
            <Icon name='video camera' />
          </Menu.Item>
  
          <Menu.Item
            name='video play'
            active={activeItem === 'video play'}
            onClick={handleItemClick}
          >
            <Icon name='video play' />
          </Menu.Item>
        </Menu>
      )
}

export default SideMenu;