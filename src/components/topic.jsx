import React from 'react';
import { Form } from 'semantic-ui-react';

const Topic = ({handleTopicAndSubject, topic = " ", subtopic = " "}) => {
    return (
        <Form.Group inline>
            <Form.Field>
                <label>Topic</label>
                <input name="topic" value={topic} onChange={handleTopicAndSubject} placeholder='Topic' />
            </Form.Field>
            <Form.Field>
                <label>Sub Topic</label>
                <input name="subTopic" value={subtopic} onChange={handleTopicAndSubject} placeholder='Sub Topic' />
            </Form.Field>
        </Form.Group>
    );
}

export default Topic;