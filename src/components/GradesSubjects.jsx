import { useState, useEffect, useContext } from "react";
import { Card, Grid, Image, Label, Icon, Button } from 'semantic-ui-react';

import Navbar from "./Navbar"
import { PaperContext } from "../context/paperContext";

const GradeDisplay = ({gradeName, isLive}) => {
    console.log(isLive)
    return (
        <Card onClick={e => {
            // take the guy to the details of the grade
            console.log("Clicked")
        }}>
            <Image src={`${process.env.REACT_APP_ZOEZI_MAIN_SERVER_ENDPOINT}/img/${gradeName}.png`} fluid wrapped ui={false} />
            <Card.Content textAlign="center">
                <Card.Header>{gradeName.toUpperCase()}</Card.Header>
                <Card.Meta>
                    <span className='date'>{isLive ? <Label basic color="green">
                       <Icon name="check circle outline"/> Published
                    </Label> 
                        : <Label basic color="orange">
                            <Icon name="cancel"/> Not Published
                        </Label>}</span>
                </Card.Meta>
            </Card.Content>
            <Card.Content extra>
                <Button basic compact icon="eye" color="green" labelPosition="left" content="Subjects" fluid>
                </Button>
            </Card.Content>
        </Card>
    )
}

const GradesSubjects = () => {
    const { fetchAdminGrades, authToken } = useContext(PaperContext)
    const [grades, setGrades] = useState([]);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        fetchAdminGrades(authToken)
            .then(({ data }) => {
                if (data && data.status) {
                    return setGrades(data.grades);
                }
            })
            .catch(error => {
                setErrors([
                    error.message
                ])
            })
    },[]);

    return (
        <>
        <Navbar/>
            <Grid style={{marginTop:"20px"}}>
                <Grid.Row>
                    {grades && grades.map(({_id, grade, available }) => {
                        return (
                            <Grid.Column style={{ marginBottom: "10px" }} computer="4" tablet="8" mobile="8" width="4" key={_id}>
                                <GradeDisplay gradeName={grade} isLive={available}/>
                            </Grid.Column>
                        )
                    })}
                </Grid.Row>
            </Grid>
        </>
    )
}

export default GradesSubjects;