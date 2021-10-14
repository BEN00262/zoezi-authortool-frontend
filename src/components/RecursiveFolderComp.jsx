import axios from 'axios';
import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Icon, List, Header } from 'semantic-ui-react';
import { PaperContext } from '../context/paperContext';


// this takes in the name of the folder and the contained files
// rootfolder --> 
const RFolderComp = ({ parentName, spaper, rootPath, isRootFolder = false }) => {
    const { changeRootPaperID, authToken, paperID, changeSpecialPaperID } = useContext(PaperContext);
    const [isOpen,setIsOpen] = useState(false);
    const [isFileDisplay, setIsFileDisplay] = useState(false)
    const [files, setFiles] = useState([])

    const openFolder = () => {
        setIsOpen(old => !old)

        if (isRootFolder) {
            changeRootPaperID(spaper._id)
        }
    }

    useEffect(() => {
        if (isOpen) {
            axios.get(`/special-paper/${rootPath}`, {
                headers: { AuthToken: authToken }
            }).then(({data}) => {
                if (!data.status) {
                    throw new Error(data.error || "Unable to fetch folders")
                }
                
                setIsFileDisplay(data.files.areFiles)
                setFiles(data.files.folders)

                console.log(data.files.folders)

            }).catch(error => {
                console.log(error)
            })
        }
    }, [isOpen])
    
    return (
        <div style={{
            marginLeft: isRootFolder ? "inherit" : "15px"
        }}>
            <Header as="h5" onClick={openFolder} style={{cursor:'pointer'}}>
                <Icon disabled name={isOpen ? 'folder open' : 'folder'} />
                {parentName}
            </Header>

            {isOpen ? !isFileDisplay ? 
                <>
                    {files.map(({name, _id}) => {
                        return <RFolderComp  parentName={name} spaper={{}} rootPath={`${rootPath}/${_id}`}/>
                    })}
                </> 
            :
                <div style={{marginLeft:"10px", marginBottom:"10px"}} hidden={!isOpen }>
                    <List divided verticalAlign='middle'>
                        {files.map(({subject, _id},index) => {
                            const isSelected = paperID === _id;
                            return (
                                // onContextMenu={(e) => _handlePaperSelectContextMenu(e,`${pp._id}`)}
                                <List.Item key={`pp_${index}`} onClick={() => changeSpecialPaperID(`${_id}`)}>
                                    <List.Icon name={isSelected ?'file alternate' : 'file alternate outline'} />
                                    <List.Content>
                                        
                                        <List.Header as='a'>
                                            <div style={{
                                                textDecoration:isSelected ? "underline" : "inherit",
                                            }}>
                                                {subject.charAt(0).toUpperCase() + subject.slice(1)}
                                            </div>
                                        </List.Header>
                                    </List.Content>
                                </List.Item>
                            );
                        })}
                    </List>
                </div>
            : null}
        </div>
    )
}

const RecursiveFolderComp = () => {
    const { spapers, changeRootPaperID } = useContext(PaperContext);

    // for now we set only the top level elements as root its


    return (
        <>
            {Object.entries(spapers).map(([name, spaper]) => {
                return <RFolderComp 
                    parentName={name} spaper={spaper} 
                    rootPath={spaper._id} isRootFolder={true}
                />
            })}
        </>
    )
}

export default RecursiveFolderComp;