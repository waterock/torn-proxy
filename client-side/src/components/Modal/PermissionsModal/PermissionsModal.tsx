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
                    ['ammo', false],
                    ['attacks', false],
                    ['attacksfull', false],
                    ['bars', false],
                    ['basic', false],
                    ['battlestats', false],
                    ['bazaar', false],
                    ['cooldowns', false],
                    ['crimes', false],
                    ['discord', false],
                    ['display', false],
                    ['education', false],
                    ['events', false],
                    ['gym', false],
                    ['hof', false],
                    ['honors', false],
                    ['icons', false],
                    ['inventory', false],
                    ['jobpoints', false],
                    ['medals', false],
                    ['merits', false],
                    ['messages', false],
                    ['money', false],
                    ['networth', false],
                    ['notifications', false],
                    ['perks', false],
                    ['personalstats', false],
                    ['profile', false],
                    ['properties', false],
                    ['receivedevents', false],
                    ['refills', false],
                    ['revives', false],
                    ['revivesfull', false],
                    ['stocks', false],
                    ['timestamp', false],
                    ['travel', false],
                    ['weaponexp', false],
                    ['workstats', false],
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
