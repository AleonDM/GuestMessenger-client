import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import styles from "../styles/Chat.module.css"
import icon from "./images/emoji.svg"
import EmojiPicker from "emoji-picker-react";
import Messages from "./Messages.jsx"

const socket = io.connect('https://guestmessenger-server.onrender.com');

const Chat = () => {
    const { search } = useLocation();
    const navigate = useNavigate();
    const [params, setParams] = useState({room: "", user: ""});
    const[state, setState] = useState([]);
    const [message, setMessage] = useState("");
    const [isOpen, setOpen] = useState(false);
    const [users, setUsers] = useState(0);

    useEffect(() => {
        const searchParams = Object.fromEntries(new URLSearchParams(search))
        setParams(searchParams)
        socket.emit('join', searchParams)
    }, [search])

    useEffect(() => {
        socket.on('message', ({data}) => {
            setState((_state) => [ ..._state, data ]);
        })
    }, [])

    useEffect(() => {
        socket.on('room', ({data: {users}}) => {
            setUsers(users.length);
        })
    }, [])
    
    const leftRoom = () => {
        socket.emit('leftRoom', { params })
        navigate("/");
    }

    const handleChange = ({target: { value } }) => setMessage(value);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!message) return;

        socket.emit('sendMessage', { message, params })

        setMessage("");
    }

    const onEmojiClick = ({emoji}) => setMessage(`${message} ${emoji}`)

    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <div className={styles.title}>
                    {params.room}
                </div>
                <div className={styles.users}>
                    {users} участников в чате
                </div>
                <button className={styles.left} onClick={leftRoom}>
                    Покинуть чат
                </button>
            </div>

            <div className={styles.messages}>
                <Messages messages={state} name={params.name} />
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.input}>
                    <input
                    type="text" 
                    name="message" 
                    value={message}
                    placeholder="Сообщение"  
                    autoComplete="off"
                    required
                    onChange={handleChange}
                    />
                </div>
                <div className={styles.emoji}>
                    <img src={icon} alt="Emojies" onClick={() => setOpen(!isOpen)} />
                    {isOpen && (
                        <div className={styles.emojies}>
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                </div>
                <div className={styles.button}>
                    <input type="submit" onSubmit={handleSubmit} value="Отправить" />
                </div>
            </form>
        </div>
    )
}

export default Chat;
