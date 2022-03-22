export const filterFunction = (key, list, value) => {
    switch (key) {
        case 'fo':
            return list.filter(fo => fo.name.toLowerCase().replaceAll(' ', '').replaceAll(' ', '').includes(value.toLowerCase().replaceAll(' ', '').replaceAll(' ', '')) || !value)
        case 'subject':
            return list.map(fo => {
                const newSubjectsList = fo.subjectsList.filter(subject => subject.name.toLowerCase().replaceAll(' ', '').replaceAll(' ', '').includes(value.toLowerCase().replaceAll(' ', '').replaceAll(' ', '')) || !value);
                return (newSubjectsList.length ? {
                    ...fo,
                    subjectsList: newSubjectsList
                } : undefined)
            }).filter(el => el)
        case 'mo':
            return list.map(fo => {
                const newSubjectsList = fo.subjectsList.map(subject => {
                    const newMoList = subject.moList.filter(mo => mo.name.toLowerCase().replaceAll(' ', '').replaceAll(' ', '').includes(value.toLowerCase().replaceAll(' ', '').replaceAll(' ', '')) || !value);
                    return (newMoList.length ? {
                        ...subject,
                        moList: newMoList
                    } : undefined)
                }).filter(el => el);
                return (newSubjectsList.length ? {
                    ...fo,
                    subjectsList: newSubjectsList
                } : undefined)
            }).filter(el => el)
        case 'moOrOktmo':
            return list.map(fo => {
                const newSubjectsList = fo.subjectsList.map(subject => {
                    const newMoList = subject.moList.filter(mo => mo.name.toLowerCase().replaceAll(' ', '').replaceAll(' ', '').includes(value.toLowerCase().replaceAll(' ', '').replaceAll(' ', '')) || mo.oktmo.toLowerCase().replaceAll(' ', '').replaceAll(' ', '').includes(value.toLowerCase().replaceAll(' ', '').replaceAll(' ', '')) || !value);
                    return (newMoList.length ? {
                        ...subject,
                        moList: newMoList
                    } : undefined)
                }).filter(el => el);
                return (newSubjectsList.length ? {
                    ...fo,
                    subjectsList: newSubjectsList
                } : undefined)
            }).filter(el => el)
        default: return list;

    }
};

export const CheckBoxLine = ({selected, text, onClick, className}) => {
    return (
        <span className={className}>
            <input type={"checkbox"} checked={selected} onChange={onClick}/>
            {text}
        </span>
    );
};