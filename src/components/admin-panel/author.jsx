import { Button, Card, Divider, Statistic } from "semantic-ui-react"

const Author = () => {
    return (
        <Card>
            <Card.Content>
                <Card.Header>
                    John Kerama
                </Card.Header>
                <Card.Meta>
                    johnnesta2018@gmail.com
                </Card.Meta>
                <Statistic size='tiny'>
                    <Statistic.Value>10</Statistic.Value>
                    <Statistic.Label>Papers</Statistic.Label>
                </Statistic>
                <Divider/>
                <Button basic compact content="Edit" labelPosition="right" color="green" icon="edit outline"/>
                <Button basic compact content="Delete" labelPosition="right" color="red" icon="trash alternate outline"/>
            </Card.Content>
        </Card>
    )
}

export default Author;