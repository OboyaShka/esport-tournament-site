import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import {useMessage} from '../hooks/message.hook';
import {useHttp} from '../hooks/http.hook';
import DatePicker from 'react-datepicker'
import FileUpload from "../components/FileUpload";
import {resetFirstInputPolyfill} from "web-vitals/dist/modules/lib/polyfills/firstInputPolyfill";
import {Loader} from "../components/Loader";
import Select from 'react-select'
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

export const TournamentsCreatePage = () => {
    const [startDate, setStartDate] = useState(new Date());
    const history = useHistory()
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()
    const [tournament, setTournament] = useState(null)
    const OBJECT_ID = new URLSearchParams(window.location.search).get('id') || null;
    const [form, setForm] = useState({
        title: '', game: '', typeTour: '', description: '', image: "", date: ''
    })


    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    //setForm({...form, title: tournament.title, game: tournament.game, description: tournament.description, image: tournament.image, date: tournament.date})

    //Подтягиваем информацию о турнире

    const getTournament = useCallback(async () => {
        try {
            if (OBJECT_ID) {
                const fetched = await request(`/api/tournaments/${OBJECT_ID}`, 'GET', null)
                form.title = fetched.title
                form.game = fetched.game
                form.typeTour = fetched.typeTour
                form.description = fetched.description
                form.image = fetched.image
                form.date = fetched.date
                setTournament(fetched)
            }
        } catch (e) {

        }
    }, [OBJECT_ID, request, setForm])

    useEffect(() => {
        getTournament()
    }, [getTournament])


    // useEffect(() => {
    //     setForm()
    // },[setForm])

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

    const changeSelectHandlerType = event => {
        setForm({...form, typeTour: event.value})
    }


    const changeDateHandler = event => {
        setStartDate(event)
        setForm({...form, date: event})
    }

    const createHandler = useCallback(async () => {
        try {
            const data = await request('/api/tournaments/create', 'POST', {...form}, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)
            history.push('/tournaments')
        } catch (e) {
        }
    }, [auth.token, request, {...form}])

    const editHandler = useCallback(async () => {
        try {
            const data = await request('/api/tournaments/edit', 'PUT', {...form, OBJECT_ID}, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)
            history.push(`/tournaments/${OBJECT_ID}`)
        } catch (e) {
        }
    }, [auth.token, request, {...form}])

    const cancelHandler = async (event) => {
        try {
            if (OBJECT_ID) {
                history.push(`/tournaments/${OBJECT_ID}`)
            } else
                history.push('/tournaments')
        } catch (e) {

        }
    }

    const options = [
        {value: 'League of Legends', label: 'League of Legends'},
        {value: 'Dota 2', label: 'Dota 2'},
    ]

    const optionsType = [
        {value: '1x1', label: '1x1'},
        {value: '5x5', label: '5x5'},
        {value: '5x5 RTC', label: '5x5 RTC'},
    ]


    if (loading) {
        return <Loader/>
    }

    if (form.title != undefined) {
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
                            onChange={changeHandler}
                            value={form.title}
                        />
                        <label htmlFor="password">Введите название турнира</label>
                    </div>

                    <Select
                        id="game"
                        name="game"
                        options={options}
                        value={{label: form.game, value: form.game}}
                        onChange={changeSelectHandler}
                        // placeholder={form.game}
                    />
                    <Select
                        id="typeTour"
                        name="typeTour"
                        options={optionsType}
                        value={{label: form.typeTour, value: form.typeTour}}
                        onChange={changeSelectHandlerType}
                        // placeholder={form.game}
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
                            dateFormat="dd/MM/yyyy HH:mm"
                            timeFormat="HH:mm"
                            value={moment(form.date).format("DD/MM/YY HH:mm")}
                            showTimeInput
                        />
                        {OBJECT_ID ?
                            <div>
                                <h3>Изображение</h3>
                                <img style={{width: "25%"}} src={form.image} alt=""></img>
                            </div> : ""}
                    </div>
                    <FileUpload form={form} setForm={setForm}/>
                </div>

                <div className="card-action">
                    {OBJECT_ID ?
                        <button
                            className="btn yellow darken-4"
                            onClick={editHandler}
                        >Сохранить
                        </button> :
                        <button
                            className="btn yellow darken-4"
                            onClick={createHandler}
                        >Создать
                        </button>}
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

}

