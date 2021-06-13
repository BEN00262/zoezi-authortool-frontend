import { useState } from "react";
import { Button, Form } from "semantic-ui-react"


// start working on this now
const SearchForm = ({ setSearchTerm: setParentSearchTerm }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const changeSearchTerm = (e) => {
        setSearchTerm(e.target.value);
    }

    const searchDB = (e) => {
        e.preventDefault();
        setParentSearchTerm(searchTerm);
    }

    return (
        <div style={{
            marginBottom:"10px"
        }}>
            <Form onSubmit={searchDB}>
                <Form.Field>
                    <input type="search" style={{
                        maxWidth:"80%",
                        marginRight:"10px"
                    }} placeholder="Search..." onChange={changeSearchTerm} value={searchTerm}/>
                    <Button content="SEARCH" icon="search" color="green" basic circular labelPosition="right"/>
                </Form.Field>
            </Form>
        </div>
    )
}

export default SearchForm;