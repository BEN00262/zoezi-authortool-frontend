import { useState } from "react"
import { Button, Card, Container, Form, Dropdown, Segment, Grid } from "semantic-ui-react"

const options = [
    { key: 'angular', text: 'Angular', value: 'angular' },
    { key: 'css', text: 'CSS', value: 'css' },
    { key: 'design', text: 'Graphic Design', value: 'design' },
    { key: 'ember', text: 'Ember', value: 'ember' },
    { key: 'html', text: 'HTML', value: 'html' },
  ]

  const permissions = [
    { key: 'review', text: 'Review', value: 'can:review' },
    { key: 'write', text: 'Write', value: 'can:write' },
  ]

const AllocationComp = () => {
    return (
        <Segment clearing padded>            
            <Form.Field>
                <Dropdown placeholder='Grade' fluid selection options={options} />
            </Form.Field>
            <Form.Field>
                <Dropdown placeholder='Subjects' fluid multiple selection options={options} />
            </Form.Field>
            <Form.Field>
                <Button type="button" basic labelPosition="right" content="delete" icon="trash alternate outline" compact color="red"/>
            </Form.Field>
        </Segment>
    )
}

const NewAuthor = () => {
    const [gradeCount, setGradeCount] = useState([])

    return (
        // <Card fluid>
        //     <Container>
        <div style={{
            marginTop:"20px"
        }}>
              <Form>
            <Grid>
                <Grid.Column width={5}>
                    <Card fluid>
                        <Card.Content>
                            <Form.Field>
                                <label>Author's Email</label>
                                <input type="email" required/>
                            </Form.Field>

                            <Form.Field>
                                <label>Permissions</label>
                                <Dropdown placeholder='Permissions' fluid multiple selection options={permissions} />
                            </Form.Field>
                            <Form.Field>
                                <Button compact fluid content="CREATE AUTHOR" icon="save" basic color="green" labelPosition="right"/>
                            </Form.Field>
                        </Card.Content>
                    </Card>
                </Grid.Column>
                <Grid.Column width={11}>
                    <Form.Field>
                        <Button raised type="button" onClick={() => {
                            setGradeCount([...gradeCount,1])
                        }} compact content="Grade" icon="add" basic color="green" labelPosition="right"/>
                    </Form.Field>

                    {/* create an allocation stuff */}
                    {gradeCount.length ? <div style={{
                        marginBottom:"10px"
                    }}>
                            {gradeCount.map((_,index) => {
                                return (
                                    <AllocationComp key={index}/>
                                )
                            })}
                    </div> : null }
                </Grid.Column>
            </Grid>
        </Form>
        </div>

        //     </Container>
        // </Card>
    )
}

export default NewAuthor;