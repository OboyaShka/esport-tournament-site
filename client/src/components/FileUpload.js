import React, {Fragment, useCallback, useContext, useState} from 'react'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import axios from "axios";
import LoadImg from "../img/load_img.svg"

const FileUpload = props => {
    const [uploadedFile, setUploadedFile] = useState({})
    const [file, setFile] = useState('')
    const [filename, setFilename] = useState('Выберите файл')
    const {loading, request} = useHttp()
    const auth = useContext(AuthContext)

    const onChange = e => {
        if (e.target.files[0] && e.target.files[0].name) {
            setFile(e.target.files[0])
            setFilename(e.target.files[0].name)
        }
    }


    const loadFile = async e => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await axios.post('/api/upload', formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
            const {fileName, filePath} = res.data
            setUploadedFile({fileName, filePath})
            props.setForm({...props.form, image: filePath})
        } catch (e) {

        }
    }


    return (
        <Fragment>
            <form onSubmit={loadFile}>
                <div className="input__wrapper">
                    <input name="file" type="file" name="file" id="input__file" className="input input__file" onChange={onChange}/>
                        <label htmlFor="input__file" className="input__file-button">
                            <span className="input__file-icon-wrapper">
                                <img className="input__file-icon"
                                     src={LoadImg}
                                     alt="Выбрать файл"
                                     width="25"/>
                            </span>
                            <span className="input__file-button-text">Выберите файл</span>
                        </label>
                    <div>
                        <input className="chat-button input__wrapper load-button" type="submit" value="Загрузить"/>
                    </div>
                </div>
                {/*<div>*/}
                {/*    <div >*/}
                {/*        <input className="chat-button" type="file" id="customFile" onChange={onChange}/>*/}
                {/*        /!*<label htmlFor="customFile">{filename}</label>*!/*/}
                {/*    </div>*/}


                {/*</div>*/}
            </form>
            {uploadedFile ? <div>
                <div className="img-load">
                    {/*<p>{uploadedFile.fileName}</p>*/}
                    <img style={{width: "100%", borderRadius:"25px"}} src={`${uploadedFile.filePath}`} alt=""></img>
                </div>
            </div> : ""}
        </Fragment>
)
}

export default FileUpload