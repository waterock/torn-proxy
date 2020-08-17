import React, { FC } from 'react';
import styles from './Button.module.scss';

interface Props {
    type: 'action'
    appearance: 'default' | 'danger'
    disabled?: boolean
    onClick(event: React.MouseEvent): any
}

const Button: FC<Props> = ({ children, type, appearance, disabled, onClick }) => {
    const classes = [
        styles.root,
        styles['type-' + type],
        styles['appearance-' + appearance],
    ];

    return (
        <button
            className={classes.join(' ')}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
