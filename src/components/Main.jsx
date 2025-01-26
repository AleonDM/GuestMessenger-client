import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from  '../styles/Main.module.css'

const FIELDS = {
    NAME: "name",
    ROOM: "room"
};

const Main = () => {

    const { NAME, ROOM } = FIELDS;

    const [values, setValues] = useState({ [NAME]: "", [ROOM]: "" });

    const handleChange = ({ target: {value, name}}) => {
        setValues({...values, [name]: value});
    };

    const handleClick = (e) => {
        const isDisabled = Object.values(values).some((value) => !value);
        if(isDisabled) e.preventDefault();
    }

    return (
<div className={styles.wrap}>
    <div className={styles.container}>
        <h1 className={styles.heading}>Guest</h1>

        <form className={styles.form}>
            <div className={styles.group}>
                <input
                type="text" 
                name="name" 
                value={values[NAME]}
                placeholder="Никнейм"
                className={styles.input}  
                autoComplete="off"
                required
                onChange={handleChange}
                />
            </div>
            <div className={styles.group}>
                <input
                type="text" 
                name="room" 
                value={values[ROOM]} 
                placeholder="Чат"
                className={styles.input} 
                autoComplete="off"
                required
                onChange={handleChange}
                />
            </div>

            <Link 
            className={styles.group} 
            to={`/chat?name=${values[NAME]}&room=${values[ROOM]}`}
            onClick={handleClick}
            >
                    <button type="submit" className={styles.button}>
                        Войти
                    </button>
            </Link>
        </form>
    </div>
</div>
    )
}

export default Main;