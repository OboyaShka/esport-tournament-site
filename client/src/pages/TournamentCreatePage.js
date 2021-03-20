import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import {useMessage} from '../hooks/message.hook';
import {useHttp} from '../hooks/http.hook';
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import FileUpload from "../components/FileUpload";

export const TournamentsCreatePage = () => {
    const [startDate, setStartDate] = useState(new Date());
    const history = useHistory()
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()
    const [form, setForm] = useState({
        title: '', game: '', description: '', image: "1",  date: ''
    })

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])




    // const fileUp = useCallback( async () => {
    //     try {
    //         const data = await request('/api/fileuploads', 'POST', {...form}, {
    //             Authorization: `Bearer ${auth.token}`
    //         })
    //
    //     } catch (e) {}
    // }, [])

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const changeSelectHandler = event => {
        setForm({...form, game: event.value})
    }

    const changeDateHandler = event => {
        setStartDate(event)
        setForm({...form, date: event})
    }

    const createHandler = useCallback( async () => {
        try {
            const data = await request('/api/tournaments/create', 'POST', {...form}, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)
            history.push('/tournaments')
        } catch (e) {}
    }, [auth.token, request, {...form}])

    const cancelHandler = async (event) => {
        try {
            history.push('/tournaments')
        } catch (e) {

        }
    }

    const options = [
        {value: 'League of Legends', label: 'League of Legends'},
        {value: 'Dota 2', label: 'Dota 2'},
    ]

    return (
        <div>
            <span className="card-title">Создание турнира</span>

            <div>
                <div className="input-field">
                    <input
                        id="title"
                        name="title"
                        type="text"
                        disabled={loading}
                        value={form.title}
                        onChange={changeHandler}
                    />
                    <label htmlFor="password">Введите название турнира</label>
                </div>
                <Select
                    id="game"
                    name="game"
                    options={options}
                    onChange={changeSelectHandler}
                />
                <div className='input-field'>
                    <input
                        id="description"
                        name="description"
                        type="text"
                        disabled={loading}
                        value={form.description}
                        onChange={changeHandler}
                    />
                    <label htmlFor="password">Введите описание турнира</label>
                </div>
                <div>
                    <DatePicker
                        selected={startDate}
                        onChange={changeDateHandler}
                        timeInputLabel="Time:"
                        dateFormat="MM/dd/yyyy h:mm aa"
                        showTimeInput
                    />
                </div>
                <FileUpload/>
            </div>
            <div className="card-action">
                <button
                    className="btn yellow darken-4"
                    onClick={createHandler}
                >Создать
                </button>
                <button
                    className="btn grey lighten-1 black-text"
                    onClick={cancelHandler}
                    disabled={loading}
                >Отмена
                </button>
            </div>
        </div>
    )

}