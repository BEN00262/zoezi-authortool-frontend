import { useState, useEffect, useContext } from "react";
import { Button, Form, Divider } from "semantic-ui-react"
import queryString from 'query-string';

import FilterComp from './FilterComp'
import { PaperContext } from "../context/paperContext";


// start working on this now
const SearchForm = ({ setSearchTerm: setParentSearchTerm }) => {
    const { setIsRefreshingDispatch, isRefreshing } = useContext(PaperContext)
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory,setSearchCategory] = useState("");

    const changeSearchTerm = (e) => {
        setSearchTerm(e.target.value);
    }

    useEffect(() => {
        if (searchCategory === "none"){
            setIsRefreshingDispatch(!isRefreshing);
        }
    },[searchCategory])


    const searchDB = (e) => {
        e.preventDefault();
        let searchString = {}

        if (searchTerm) {
            searchString.searchTerm = searchTerm
        }

        if (searchCategory){
            searchString.searchCategory = searchCategory
        }

        setParentSearchTerm(queryString.stringify(searchString));
        setSearchTerm("");
        setSearchCategory("");
    }

    return (
        <>
            <Form onSubmit={searchDB}>
                    <Form.Group >
                        <Form.Field width={11}>
                            <input type="search" placeholder="Search..." onChange={changeSearchTerm} value={searchTerm}/>
                        </Form.Field>
                        <Form.Field width={2}>
                            <FilterComp setChooseCategory={setSearchCategory}/>
                        </Form.Field>
                        <Form.Field width={2}>
                            <Button content="SEARCH" icon="search" color="green" basic labelPosition="right"/>
                        </Form.Field>
                    </Form.Group>
            </Form>
            <Divider/>
        </>
    )
}

export default SearchForm;