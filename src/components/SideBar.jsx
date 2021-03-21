import React,{useEffect,useContext} from 'react';

import {PaperContext} from "../context/paperContext";
import SModal from './SModal';
import FolderComp from './FolderComp';

const SideBar = () => {
    const {changePaperID,createPaperDispatch,papers,authToken,fetchPapers} = useContext(PaperContext);
    
    useEffect(() => {
        fetchPapers(authToken);
    },[]);

    const createPaper = (paper) => {
        createPaperDispatch(paper,authToken);
    }

    const handlePaperSelect = (paper_id) => {
        changePaperID(paper_id);
    }

    // create a folder view for these files and groupings
    return (
        <>
            <SModal createPaper={createPaper}/>
            <div  style={{height:"85vh", overflowY:"scroll", marginTop:"10px", padding:"10px"}}>
                {Object.keys(papers).map((paperType,p_index) => {
                    return (
                        <React.Fragment key={`pt_${p_index}`}>
                            <FolderComp handlePaperSelect={handlePaperSelect}
                                paperType={paperType}
                                papers = {papers[paperType].papers}
                            />
                        </React.Fragment>
                    );
                })}
            </div>
        </>
    );
}

export default SideBar;