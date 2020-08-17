import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.scss';

interface Props {
    title: string
    onClose(): any
}

const Modal: FC<Props> = ({ title, children, onClose }) => {
    return ReactDOM.createPortal(
        <>
            <div className={styles.modal}>
                <div className={styles.content}>
                    <div className={styles.header}>{title}</div>
                    <div className={styles.body}>
                        { children }
                    </div>
                </div>
            </div>
            <div className={styles.backdrop} onClick={onClose}/>
        </>,
        document.body,
    );
}

export default Modal;
