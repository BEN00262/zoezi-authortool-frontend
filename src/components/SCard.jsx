import React from 'react';
import {Card} from 'semantic-ui-react';

const SCard = ({children,...rest}) => {
    return (
        <Card fluid={true} {...rest}>
            <Card.Content>
                {children}
            </Card.Content>
        </Card>
    );
}

export default SCard;