import React, { FC } from 'react';
import Modal from '../Modal';
import Key from '../../../interfaces/Key';
import Section from './Section';
import SectionInterface from './Section/SectionInterface';

interface Props {
    keyEntity: Key
    onClose(): any
}

const PermissionsModal: FC<Props> = ({ keyEntity, onClose }) => {

    const tornSection: SectionInterface = {
        label: 'Torn',
        childSections: [
            {
                label: 'user',
                permissions: [
                    ['ammo', true],
                    ['attacks', false],
                ],
            },
            {
                label: 'property',
                permissions: [
                    ['property', true],
                    ['timestamp', true],
                ],
            }
        ]
    };

    const tornstatsSection: SectionInterface = {
        label: 'Tornstats',
        permissions: [
            ['allow', false],
        ]
    }

    return (
        <Modal title={`Permissions for "${keyEntity.description}"`} onClose={onClose}>

            <Section section={tornSection}/>
            <Section section={tornstatsSection}/>

        </Modal>
    )
}

export default PermissionsModal;
