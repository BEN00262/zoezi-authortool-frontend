import { Container, Grid } from "semantic-ui-react";
import Author from "./author"

const AuthorList = () => {
    return (
        <Container style={{
            marginTop:"10px"
        }}>
            <Grid columns={4}>
            {
                (new Array(10).fill(1)).map(_ => {
                    return (
                        <Grid.Column>
                            <Author/>
                        </Grid.Column>
                    )
                })
            }
            </Grid>
        </Container>
    )
}

export default AuthorList;