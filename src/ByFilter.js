import {useState} from "react";
import {CheckBoxLine, filterFunction} from "./helpers";

export const ByFilter = ({state, setState, allSelected, setAllSelected}) => {
    const [foFilter, setFoFilter] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('');
    const [moFilter, setMoFilter] = useState('');

    const foToDisplay = filterFunction('fo', state, foFilter);
    const subjectsToDisplay = filterFunction('subject', state, subjectFilter);
    const moToDisplay = filterFunction('moOrOktmo', state, moFilter);

    const onAllSelectedChange = (e) => {
        const selected = e.target.checked;
        setAllSelected(selected);
        setState(prevState => prevState.map(fo => ({
            ...fo,
            selected,
            subjectsList: fo.subjectsList.map(subj => ({
                ...subj,
                selected,
                moList: subj.moList.map(mo => ({
                    ...mo,
                    selected
                }))
            }))
        })));
    };

    const onFoChange = (foName) => (e) => {
        const selected = e.target.checked;
        const allOtherSelected = (state.map(fo => fo.selected).filter(el => el).length === state.length - 1) && !state.find(el => el.name === foName).selected;
        setAllSelected(selected && allOtherSelected);
        setState(prevState => prevState.map((fo, foInd) => ({
                ...fo,
                selected: foName === fo.name ? selected : fo.selected,
                subjectsList: fo.subjectsList.map(subj => ({
                    ...subj,
                    selected: foName === fo.name ? selected : fo.selected,
                    moList: subj.moList.map(mo => ({
                        ...mo,
                        selected: foName === fo.name ? selected : fo.selected,
                    }))
                }))
            })
        ));
    };

    const onSubjectChange = (foName, subjectName) => (e) => {
        const selected = e.target.checked;
        const curFo = state.find(el => el.name === foName);
        const curSubject = curFo.subjectsList.find(el => el.name === subjectName);
        const allOtherSelected = (state.map(fo => fo.selected).filter(el => el).length === state.length - 1) && !state.find(el => el.name === foName).selected;
        const allOtherSubjectsSelected = (curFo.subjectsList.map(subject => subject.selected).filter(el => el).length === curFo.subjectsList.length - 1) && !curSubject.selected;

        setAllSelected(selected && allOtherSelected && allOtherSubjectsSelected);
        setState(prevState => prevState.map((fo, foCurInd) => ({
            ...fo,
            selected: foName === fo.name ? allOtherSubjectsSelected && selected : fo.selected,
            subjectsList: fo.subjectsList.map((subj, curSubjectInd) => ({
                ...subj,
                selected: (foName === fo.name) && (subjectName === subj.name) ? selected : subj.selected,
                moList: subj.moList.map(mo => ({
                    ...mo,
                    selected: (foName === fo.name) && (subjectName === subj.name) ? selected : subj.selected,
                }))
            }))
        })));
    };

    const onMoChange = (foName, subjectName, moName) => (e) => {
        const selected = e.target.checked;
        const curFo = state.find(el => el.name === foName);
        const curSubject = curFo.subjectsList.find(el => el.name === subjectName);
        const curMo = curSubject.moList.find(el => el.name === moName);

        const allOtherFoSelected = (state.map(fo => fo.selected).filter(el => el).length === state.length - 1) && !state.find(el => el.name === foName).selected;
        const allOtherSubjectsSelected = (curFo.subjectsList.map(subject => subject.selected).filter(el => el).length === curFo.subjectsList.length - 1) && !curSubject.selected;
        const allOtherMoSelected = (curSubject.moList.map(mo => mo.selected).filter(el => el).length === curSubject.moList.length - 1) && !curMo.selected;

        setAllSelected(selected && allOtherFoSelected && allOtherSubjectsSelected && allOtherMoSelected);
        setState(prevState => prevState.map((fo, foCurInd) => ({
            ...fo,
            selected: foName === fo.name ? allOtherSubjectsSelected && allOtherMoSelected && selected : fo.selected,
            subjectsList: fo.subjectsList.map((subj, curSubjectInd) => ({
                ...subj,
                selected: (foName === fo.name) && (subjectName === subj.name) ? selected && allOtherMoSelected : subj.selected,
                moList: subj.moList.map((mo, curMoInd) => ({
                    ...mo,
                    selected: (foName === fo.name) && (subjectName === subj.name) && (moName === mo.name) ? selected : mo.selected,
                }))
            }))
        })));
    };

    return (
        <div>
            <div className="filters-container">
                <div className="filter-container">
                    <input placeholder="ФО" value={foFilter} onChange={(e) => setFoFilter(e.target.value)}/>
                    <div className="check-line-container scroll-restrict">
                        <CheckBoxLine onClick={onAllSelectedChange} selected={allSelected} text="Все ФО"/>
                        <div className="check-line-container">
                            {foToDisplay.map((fo, foInd) => (
                                <CheckBoxLine
                                    key={fo.name}
                                    onClick={onFoChange(fo.name)}
                                    selected={fo.selected}
                                    text={fo.name}
                                />))}
                        </div>
                    </div>
                </div>
                <div className="filter-container">
                    <input
                        placeholder="Субъект РФ"
                        value={subjectFilter}
                        onChange={(e) => setSubjectFilter(e.target.value)}
                    />
                    <div className="check-line-container scroll-restrict">
                        <CheckBoxLine
                            onClick={onAllSelectedChange}
                            selected={allSelected}
                            text="Все субъекты РФ"
                            className="sticky top-0"
                        />
                        <div className="check-line-container">
                            {subjectsToDisplay.map((fo, foInd) => (
                                <div className="check-line-container">
                                    <CheckBoxLine
                                        key={fo.name}
                                        onClick={onFoChange(fo.name)}
                                        selected={fo.selected}
                                        text={`Все субъекты ${fo.name}`}
                                        className="sticky top-1"
                                    />
                                    {/*<div
                                        className={(!fo.selected && !fo.subjectsList.filter(subject => subject.selected).length && 'invisible') || ''}
                                    >*/}
                                    {fo.subjectsList.map((subject, subjectInd) => (
                                        <div className="check-line-container">
                                            <CheckBoxLine
                                                key={fo.name + subject.name}
                                                onClick={onSubjectChange(fo.name, subject.name)}
                                                selected={subject.selected}
                                                text={subject.name}
                                            />
                                        </div>))}
                                    {/*</div>*/}
                                </div>))}
                        </div>
                    </div>
                </div>
                <div className="filter-container">
                    <input
                        placeholder="МО или ОКТМО"
                        value={moFilter}
                        onChange={(e) => setMoFilter(e.target.value)}
                    />
                    <div className="check-line-container scroll-restrict">
                        <CheckBoxLine
                            onClick={onAllSelectedChange}
                            selected={allSelected}
                            text="Все муниципальные образования"
                            className="sticky top-0"
                        />
                        <div className="check-line-container">
                            {moToDisplay.map((fo, foInd) => (
                                <div className="check-line-container">
                                    <CheckBoxLine
                                        key={fo.name}
                                        onClick={onFoChange(fo.name)}
                                        selected={fo.selected}
                                        text={`Все муниципальные образования ${fo.name}`}
                                        className="sticky top-1"
                                    />
                                    {fo.subjectsList.map((subject, subjectInd) => (
                                        <div className="check-line-container">
                                            <CheckBoxLine
                                                key={fo.name + subject.name}
                                                onClick={onSubjectChange(fo.name, subject.name)}
                                                selected={subject.selected}
                                                text={subject.name}
                                                className="sticky top-2"
                                            />

                                            {subject.moList.map((mo, moInd) => (
                                                <div className="check-line-container">
                                                    <CheckBoxLine
                                                        key={fo.name + subject.name + mo.name}
                                                        onClick={onMoChange(fo.name, subject.name, mo.name)}
                                                        selected={mo.selected}
                                                        text={mo.moWithOktmo}
                                                    />
                                                </div>))}
                                        </div>))}
                                </div>))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};