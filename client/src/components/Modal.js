import React from 'react'

export const Modal = ({active, setActive, link})=>{
    return(
        <div className={active? "modal active":"modal"} onClick={()=>setActive(false)}>
            <div className={active? "modal__content active":"modal__content"} onClick={e=>e.stopPropagation()}>
                <img   style={{width: "120%"}} src={link} alt=""></img>
            </div>
        </div>
    );
}

