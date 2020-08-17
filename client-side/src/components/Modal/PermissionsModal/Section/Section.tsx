import React, { FC } from 'react';
import styles from './Section.module.scss';
import SectionInterface from './SectionInterface';

interface Props {
    section: SectionInterface
    nestingLevel?: number
}

const Section: FC<Props> = ({ section, nestingLevel = 0 }) => {

    function renderChildSections() {
        if (!section.childSections || section.childSections.length === 0) {
            return;
        }
        return section.childSections.map((childSection) => (
            <Section key={childSection.label} section={childSection} nestingLevel={nestingLevel + 1}/>
        ));
    }

    function renderPermissions() {
        if (!section.permissions || section.permissions.length === 0) {
            return;
        }

        return section.permissions.map(([permission, granted]) => {
            return (
                <Section
                    key={permission}
                    section={{
                        label: permission,
                        granted,
                    }}
                    nestingLevel={nestingLevel + 1}
                />
            );
        });
    }

    function nest(value: any) {
        for (let i = 0; i < nestingLevel; i++) {
            value = <div className={styles.nesting}>{value}</div>;
        }
        return value;
    }

    function renderSectionGrantContents() {
        if (section.granted === undefined) {
            return null;
        }
        return <input type="checkbox" checked={section.granted} readOnly/>
    }

    return nest(
        <>
            <div className={styles.root}>
                <div className={styles.sectionLabel}>{section.label}</div>
                <div className={styles.sectionGrant}>
                    {renderSectionGrantContents()}
                </div>
            </div>
            {renderChildSections()}
            {renderPermissions()}
        </>
    )
};

export default Section;
