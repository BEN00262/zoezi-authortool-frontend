import React, { useState } from 'react';
import { Icon, Label, List, Header } from 'semantic-ui-react';


// this takes in the name of the folder and the contained files
const FolderComp = ({paperType,papers,handlePaperSelect}) => {
    const [isOpen,setIsOpen] = useState(false);

    // toggle the open and close on click :)
    return (
        <div>
            <Header as="h5" onClick={() => setIsOpen(!isOpen)} style={{cursor:'pointer'}}>
                <Icon disabled name={isOpen ? 'folder open' : 'folder'} />
                {paperType}
            </Header>

            {/* we want to display the files individually */}
            <div style={{marginLeft:"10px", marginBottom:"10px"}} hidden={!isOpen}>
                        <List divided verticalAlign='middle'>
                            {papers.map((pp,index) => {
                                return (
                                    <List.Item key={`pp_${index}`} onClick={() => handlePaperSelect(`${pp.id}`)}>
                                        <List.Icon name='file alternate outline' />
                                        <List.Content>
                                            <List.Header as='a'>
                                                {pp.name.charAt(0).toUpperCase() + pp.name.slice(1)}
                                                {/* <Label color='green' horizontal>
                                                    submitted{' '}
                                                    <Icon name='check circle outline' />
                                                </Label> */}
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