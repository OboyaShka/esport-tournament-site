import React, {Fragment, useCallback, useContext, useState} from 'react'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import axios from "axios";

const FileUpload = props => {
    const [uploadedFile, setUploadedFile] = useState({})
    const [file, setFile] = useState('')
    const [filename, setFilename] = useState('Выберите файл')
    const {loading, request} = useHttp()
    const auth = useContext(AuthContext)

    const onChange = e => {
        if(e.target.files[0] && e.target.files[0].name){
            setFile(e.target.files[0])
            setFilename(e.target.files[0].name)
        }
    }


    // const loadFile = async(e) => {
    //     e.preventDefault()
    //     const formData = new FormData()
    //     formData.append( 'file', file)
    //     try{
    //         const fetched = await request(`/api/upload/`, 'POST', {formData}, {
    //             Authorization: `Bearer ${auth.token}`,
    //         })
    //
    //         const {fileName, filePath} = fetched
    //         setUploadedFile({fileName, filePath})
    //         console.log(fileName)
    //     }catch (e) {
    //     }
    // }

    const loadFile = async e =>{
        e.preventDefault()
        const formData = new FormData()
        formData.append( 'file', file)

        try{
            const res = await axios.post('/api/upload', formData,
     {
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            })
            const {fileName, filePath} = res.data
            setUploadedFile({fileName, filePath})
            props.setForm({...props.form, image:filePath})
        }catch (e) {
            
        }
    }



    return (
        <Fragment>
            <form onSubmit={loadFile}>
                <div>
                    <div>
                        <input type="file" id="customFile" onChange={onChange}/>
                        <label htmlFor="customFile">{filename}</label>
                    </div>

                    <div>
                        <input  type="submit" value="Upload"/>
                    </div>
                </div>
            </form>
            { uploadedFile ? <div>
                <div>
                    <h3>{uploadedFile.fileName}</h3>
                    <img style={{width:"100%"}} src={`${uploadedFile.filePath}`} alt=""></img>
                </div>
            </div> : ""}
        </Fragment>
    )
}

export default FileUpload