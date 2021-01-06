import {useEffect,useState} from "react";
import axios from "axios";


axios.defaults.baseURL = 'http://localhost:4000';

export const useAxiosPost = (url,initialData) => {
    const [postData,setPostData] = useState(null);

    useEffect(() =>{
        axios.post(url,initialData)
            .then(({data}) => {
                setPostData(data);
            })
    },[url,initialData]);

    return [postData];
}

export const useAxiosGet = (url) => {

}