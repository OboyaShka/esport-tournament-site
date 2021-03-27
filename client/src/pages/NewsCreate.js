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

export const NewsCreatePage = () => {
    const [startDate, setStartDate] = useState(new Date());
    const history = useHistory()
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()
    const [news, setNews] = useState(null)
    const OBJECT_ID = new URLSearchParams(window.location.search).get('id') || null;
    const [form, setForm] = useState({
        title: '', topic: '', content: '', image: ''
    })


    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    //setForm({...form, title: tournament.title, game: tournament.game, description: tournament.description, image: tournament.image, date: tournament.date})

    //Подтягиваем информацию о новости

    const getNews = useCallback(async () => {
        try {
            if (OBJECT_ID) {
                const fetched = await request(`/api/news/${OBJECT_ID}`, 'GET', null)
                form.title = fetched.title
                form.topic = fetched.topic
                form.image = fetched.image
                form.content = fetched.content
                form.date = fetched.date
                setNews(fetched)
            }
        } catch (e) {

        }
    }, [OBJECT_ID, request, setForm])

    useEffect(() => {
        getNews()
    }, [getNews])



    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const changeSelectHandler = event => {
        setForm({...form, game: event.value})
    }

    const changeSelectHandlerType = event => {
        setForm({...form, typeTour: event.value})
    }


    // const changeDateHandler = event => {
    //     setStartDate(event)
    //     setForm({...form, date: event})
    // }

    const createHandler = useCallback(async () => {
        try {
            const Data = new Date()
            const data = await request('/api/news/create', 'POST', {...form, date: Data}, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)
            history.push('/news')
        } catch (e) {
        }
    }, [auth.token, request, {...form}])

    const editHandler = useCallback(async () => {
        try {
            const data = await request('/api/news/edit', 'PUT', {...form, OBJECT_ID}, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)
            history.push(`/news/${OBJECT_ID}`)
        } catch (e) {
        }
    }, [auth.token, request, {...form}])

    const cancelHandler = async (event) => {
        try {
            if (OBJECT_ID) {
                history.push(`/news/${OBJECT_ID}`)
            } else
                history.push('/news')
        } catch (e) {

        }
    }



    if (loading) {
        return <Loader/>
    }

    if (form.title != undefined) {
        return (
            <div>
                <span className="card-title">Создание новости</span>

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
                        <label htmlFor="password">Введите название новости</label>
                    </div>
                    <div className='input-field'>
                        <input
                            id="topic"
                            name="topic"
                            type="text"
                            disabled={loading}
                            value={form.topic}
                            onChange={changeHandler}
                        />
                        <label htmlFor="password">Введите раздел</label>
                    </div>
                    <div className='input-field'>
                        <input
                            id="content"
                            name="content"
                            type="text"
                            disabled={loading}
                            value={form.content}
                            onChange={changeHandler}
                        />
                        <label htmlFor="password">Введите описание новости</label>
                    </div>
                    <div>
                        {/*<DatePicker*/}
                        {/*    selected={startDate}*/}
                        {/*    onChange={changeDateHandler}*/}
                        {/*    timeInputLabel="Time:"*/}
                        {/*    dateFormat="dd/MM/yyyy HH:mm"*/}
                        {/*    timeFormat="HH:mm"*/}
                        {/*    value={moment(form.date).format("DD/MM/YY HH:mm")}*/}
                        {/*    showTimeInput*/}
                        {/*/>*/}
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

