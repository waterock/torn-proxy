import React, { FC } from 'react';
import styles from './Faq.module.scss';

interface Props {
    question: string
    answer?: string
}

const Faq: FC<Props> = ({ question, answer, children }) => {
    return (
        <div className={styles.root}>
            <p className={styles.question}>{question}</p>
            {answer && <p>{answer}</p>}
            {!answer && children}
        </div>
    )
}

export default Faq;
