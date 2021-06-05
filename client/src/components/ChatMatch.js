import React, {useCallback, useContext, useEffect, useState} from 'react'
import socket from "../socket";
import {AuthContext} from "../context/AuthContext";
import moment from "moment";

export const ChatMatch = (matchId) => {

    const [message, setMessage] = useState([])
    const auth = useContext(AuthContext)
    const [messages, setMessages] = useState([])

    const getMessages = useCallback(async () => {
        try {

            socket.emit('TOURNAMENT/GET-MESSAGES', matchId)


            return () => socket.off('TOURNAMENT/GET-MESSAGES')
        } catch (e) {
        }
    }, [matchId])

    useEffect(() => {
        getMessages()
    }, [getMessages])

    useEffect(() => {
        socket.on('TOURNAMENT/GET-MESSAGES:RES', async (messages) => {
            setMessages(messages)

        })

        return () => socket.off('TOURNAMENT/GET-MESSAGES:RES')
    }, [])

    useEffect(() => {
        socket.on('TOURNAMENT/MESSAGE:RES', async () => {
            getMessages()

        })

        return () => socket.off('TOURNAMENT/GET-MESSAGES:RES')
    }, [getMessages])


    const saveMessage = (event) => {
        setMessage(event.target.value)
    }


    const sendMessage = useCallback(    async () => {
        try {
            if (message !== []) {
                socket.emit('TOURNAMENT/MESSAGE', matchId, message, auth.userId, auth.userNickname)
                setMessage("")
            }


            return () => socket.off('TOURNAMENT/MESSAGE')
        } catch (e) {
        }

    }, [matchId, message, auth.userId, auth.userNickname])

    const pressEnter = (e) => {
        if (e.key === "Enter") {
            e.SuppressKeyPress = true;
            sendMessage()
        }
    }


    return (
        <div>
            <div className="chat-match">
                <div className="chat-content">
                    {messages && messages !== [] && messages.map((msg, index) => {
                        return (
                            <div key={index} className={auth.userId === msg.user ? "chat-message" : "chat-message-my"}>
                                <p className={auth.userId === msg.user ? "chat-message-bubble" : "chat-message-bubble-my"}>{msg.content}</p>
                                {auth.userId === msg.user ?
                                    <p className="chat-message-author">{moment(msg.date).format("HH:mm")} <b>{msg.nickname}</b></p> :
                                    <p className="chat-message-author">
                                        <b>{msg.nickname}</b> {moment(msg.date).format("HH:mm")}</p>}
                            </div>
                        )
                    })}

                </div>
                <div className="chat-send">
                    <textarea id="message-input" value={message} className="chat-sendder" rows="4" onKeyDown={e => {
                        pressEnter(e)
                    }} onChange={saveMessage}></textarea>
                    <button className="chat-button" onClick={e => {
                        sendMessage()
                    }}>Отправить
                    </button>
                </div>
            </div>
        </div>
    )
}