import React from 'react';
import {Card} from 'semantic-ui-react';

const SCard = (props) => {
    return (
        <Card fluid={true}>
            <Card.Content>
                {props.children}
            </Card.Content>
        </Card>
    );
}

export default SCard;