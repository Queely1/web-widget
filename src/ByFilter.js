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

    const onFoChange = (i, source) => (e) => {
        const selected = e.target.checked;
        const allOtherSelected = (state.map(fo => fo.selected).filter(el => el).length === state.length - 1) && !state[i].selected;
        setAllSelected(selected && allOtherSelected);
        setState(prevState => prevState.map((fo, foInd) => ({
            ...fo,
            selected: i === foInd ? selected : fo.selected,
            hideVariants: source === 'fo' ? !(i === foInd ? selected : fo.selected) : false,
            subjectsList: fo.subjectsList.map(subj => ({
                ...subj,
                selected: i === foInd ? selected : fo.selected,
                hideVariants: source === 'fo' ? !(i === foInd ? selected : fo.selected) : false,
                moList: subj.moList.map(mo => ({
                    ...mo,
                    selected: i === foInd ? selected : fo.selected,
                }))
            }))
        })));
    };

    const onSubjectChange = (foInd, subjectInd, source) => (e) => {
        const selected = e.target.checked;
        const curFo = state[foInd];
        const curSubject = curFo.subjectsList[subjectInd];
        const allOtherSelected = (state.map(fo => fo.selected).filter(el => el).length === state.length - 1) && !state[foInd].selected;
        const allOtherSubjectsSelected = (curFo.subjectsList.map(subject => subject.selected).filter(el => el).length === curFo.subjectsList.length - 1) && !curSubject.selected;

        setAllSelected(selected && allOtherSelected && allOtherSubjectsSelected);
        setState(prevState => prevState.map((fo, foCurInd) => ({
            ...fo,
            selected: foInd === foCurInd ? allOtherSubjectsSelected && selected : fo.selected,
            hideVariants: fo.hideVariants,
            subjectsList: fo.subjectsList.map((subj, curSubjectInd) => ({
                ...subj,
                selected: (foInd === foCurInd) && (subjectInd === curSubjectInd) ? selected : subj.selected,
                hideVariants: source === 'subject' ? !((foInd === foCurInd) && (subjectInd === curSubjectInd) ? selected : subj.selected) : false,
                moList: subj.moList.map(mo => ({
                    ...mo,
                    selected: (foInd === foCurInd) && (subjectInd === curSubjectInd) ? selected : subj.selected,
                }))
            }))
        })));
    };

    const onMoChange = (foInd, subjectInd, moInd) => (e) => {
        const selected = e.target.checked;
        const curFo = state[foInd];
        const curSubject = curFo.subjectsList[subjectInd];
        const curMo = curSubject.moList[moInd];

        const allOtherFoSelected = (state.map(fo => fo.selected).filter(el => el).length === state.length - 1) && !state[foInd].selected;
        const allOtherSubjectsSelected = (curFo.subjectsList.map(subject => subject.selected).filter(el => el).length === curFo.subjectsList.length - 1) && !curSubject.selected;
        const allOtherMoSelected = (curSubject.moList.map(mo => mo.selected).filter(el => el).length === curSubject.moList.length - 1) && !curMo.selected;

        setAllSelected(selected && allOtherFoSelected && allOtherSubjectsSelected && allOtherMoSelected);
        setState(prevState => prevState.map((fo, foCurInd) => ({
            ...fo,
            selected: foInd === foCurInd ? allOtherSubjectsSelected && allOtherMoSelected && selected : fo.selected,
            subjectsList: fo.subjectsList.map((subj, curSubjectInd) => ({
                ...subj,
                selected: (foInd === foCurInd) && (subjectInd === curSubjectInd) ? selected && allOtherMoSelected : subj.selected,
                moList: subj.moList.map((mo, curMoInd) => ({
                    ...mo,
                    selected: (foInd === foCurInd) && (subjectInd === curSubjectInd) && (moInd === curMoInd) ? selected : mo.selected,
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
                                    onClick={onFoChange(foInd, 'fo')}
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
                                        onClick={onFoChange(foInd, 'subject')}
                                        selected={fo.selected}
                                        text={`Все субъекты ${fo.name}`}
                                        className="sticky top-1"
                                    />
                                    <div className={(fo.hideVariants && 'invisible') || ''}>
                                        {fo.subjectsList.map((subject, subjectInd) => (
                                            <div className="check-line-container">
                                                <CheckBoxLine
                                                    key={fo.name + subject.name}
                                                    onClick={onSubjectChange(foInd, subjectInd, 'subject')}
                                                    selected={subject.selected}
                                                    text={subject.name}
                                                />
                                            </div>))}
                                    </div>
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
                                        onClick={onFoChange(foInd, 'mo')}
                                        selected={fo.selected}
                                        text={`Все муниципальные образования ${fo.name}`}
                                        className="sticky top-1"
                                    />
                                    <div className={((fo.hideVariants) && 'invisible') || ''}>
                                        {fo.subjectsList.map((subject, subjectInd) => (
                                            <div className="check-line-container">
                                                <CheckBoxLine
                                                    key={fo.name + subject.name}
                                                    onClick={onSubjectChange(foInd, subjectInd, 'mo')}
                                                    selected={subject.selected}
                                                    text={subject.name}
                                                    className="sticky top-2"
                                                />
                                                <div className={((subject.hideVariants) && 'invisible') || ''}>
                                                    {subject.moList.map((mo, moInd) => (
                                                        <div className="check-line-container">
                                                            <CheckBoxLine
                                                                key={fo.name + subject.name + mo.name}
                                                                onClick={onMoChange(foInd, subjectInd, moInd)}
                                                                selected={mo.selected}
                                                                text={mo.moWithOktmo}
                                                            />
                                                        </div>))}
                                                </div>
                                            </div>))}
                                    </div>
                                </div>))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};