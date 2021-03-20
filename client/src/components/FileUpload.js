import React, {Fragment, useCallback, useContext, useState} from 'react'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";


const FileUpload = () => {
    const [file, setFile] = useState('')
    const [filename, setFilename] = useState('Выберите файл')
    const [uploadedFile, setUploadedFile] = useState({})
    const {loading, request} = useHttp()
    const auth = useContext(AuthContext)

    const onChange = e => {
        setFile(e.target.files[0])
        setFilename(e.target.files[0].name)
    }

    const loadFile = async(e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append( 'file', file)
        try{
            const fetched = await request(`/api/upload/`, 'POST', {formData}, {
                Authorization: `Bearer ${auth.token}`,
            })

            const {fileName, filePath} = fetched
            setUploadedFile({fileName, filePath})
            console.log(fileName)
        }catch (e) {
        }
    }


    return (
        <Fragment>
            <form onSubmit={loadFile}>
                <div>
                    <div >
                        <input type="file" onChange={1} id="customFile" onChange={onChange}/>
                        <label htmlFor="customFile">{filename}</label>
                    </div>

                    <div c>
                        <input  type="submit" value="Upload"/>
                    </div>
                </div>
            </form>
        </Fragment>
    )
}

export default FileUpload