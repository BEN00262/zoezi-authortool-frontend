import React, { useState, useContext } from 'react'
import {
  Checkbox,
  Grid,
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar,
} from 'semantic-ui-react';

import {PaperContext} from "../context/paperContext";

const SubmissionComp = () => {
    const { socketIO } = useContext(PaperContext);

    const [visible, setVisible] = useState(false);

    socketIO.on('submission_status',(msg) => {
        setVisible(true);
        console.log(msg);
    })

    socketIO.on('submission_error',(msg) => {
        setVisible(false);
        console.log(msg);
    })

    socketIO.on('submission_end',(msg) => {
        setVisible(false);
        console.log(msg)
    })


    return (
        <Grid columns={1}>
            <Grid.Column>
            <Checkbox
                checked={visible}
                label={{ children: <code>visible</code> }}
                onChange={(e, data) => setVisible(data.checked)}
            />
            </Grid.Column>

            <Grid.Column>
            <Sidebar.Pushable as={Segment}>
                <Sidebar
                as={Menu}
                animation='overlay'
                icon='labeled'
                inverted
                onHide={() => setVisible(false)}
                vertical
                visible={visible}
                width='thin'
                >
                <Menu.Item as='a'>
                    <Icon name='home' />
                    Home
                </Menu.Item>
                <Menu.Item as='a'>
                    <Icon name='gamepad' />
                    Games
                </Menu.Item>
                <Menu.Item as='a'>
                    <Icon name='camera' />
                    Channels
                </Menu.Item>
                </Sidebar>

                <Sidebar.Pusher dimmed={visible}>
                <Segment basic>
                    <Header as='h3'>Application Content</Header>
                    <Image src='/images/wireframe/paragraph.png' />
                </Segment>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
            </Grid.Column>
        </Grid>
    )
}

export default SubmissionComp;