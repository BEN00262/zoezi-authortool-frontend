import React, { useState, useContext } from 'react';
import { Icon, List, Header } from 'semantic-ui-react';
import { PaperContext } from '../context/paperContext';


// this takes in the name of the folder and the contained files
const FolderComp = ({paperType,papers,handlePaperSelect}) => {
    const [isOpen,setIsOpen] = useState(false);

    // listen for the active folder thing
    const {
        paperID
    } = useContext(PaperContext);

    // toggle the open and close on click :)
    return (
        <div>
            <Header as="h5" onClick={() => setIsOpen(!isOpen)} style={{cursor:'pointer'}}>
                <Icon disabled name={isOpen ? 'folder open' : 'folder'} />
                {paperType}
            </Header>

            <div style={{marginLeft:"10px", marginBottom:"10px"}} hidden={!isOpen}>
                        <List divided verticalAlign='middle'>
                            {papers.map((pp,index) => {
                                return (
                                    <List.Item key={`pp_${index}`} onClick={() => handlePaperSelect(`${pp.id}`)}>
                                        <List.Icon name='file alternate outline' />
                                        <List.Content>
                                            <List.Header as='a'>
                                                <div style={{
                                                    textDecoration:paperID === pp.id ? "underline" : "inherit",
                                                }}>
                                                    {pp.name.charAt(0).toUpperCase() + pp.name.slice(1)}
                                                </div>
                                            </List.Header>
                                        </List.Content>
                                    </List.Item>
                                );
                            })}
                        </List>
            </div>
        </div>
    )
}

export default FolderComp;