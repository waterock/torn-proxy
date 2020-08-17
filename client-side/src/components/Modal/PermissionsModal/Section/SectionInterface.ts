interface SectionInterface {
    label: string
    childSections?: SectionInterface[]
    permissions?: [string, boolean][]
    granted?: boolean
}

export default SectionInterface;
