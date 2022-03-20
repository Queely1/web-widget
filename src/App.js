import './App.css';
import { sources } from "./source";
import {useState} from "react";
import {ByFilter} from "./ByFilter";
import {ByName} from "./ByName";
import {Variables} from "./Variables";

const foWithMoList = [];
sources.forEach(line => {
  const curFo = foWithMoList.find(el => el.name === line.fo);
  if (!curFo) {
    foWithMoList.push({
      name: line.fo,
      selected: true,
      hideVariants: false,
      subjectsList: [{
        name: line.subject,
        selected: true,
        hideVariants: false,
        moList: [{
          selected: true,
          name: line.mo,
          oktmo: line.oktmo,
          moWithOktmo: line.moWithOktmo
        }]
      }]
    });
  } else {
    const curSubject = curFo.subjectsList.find(el => el.name === line.subject);
    if (!curSubject) {
      curFo.subjectsList.push({
        selected: true,
        name: line.subject,
        hideVariants: false,
        moList: [{
          selected: true,
          name: line.mo,
          oktmo: line.oktmo,
          moWithOktmo: line.moWithOktmo
        }]
      })
    } else {
      const curMo = curSubject.moList.find(el => el.name === line.mo);
      if (!curMo) {
        curSubject.moList.push({
          selected: true,
          name: line.mo,
          oktmo: line.oktmo,
          moWithOktmo: line.moWithOktmo
        })
      }
    }
  }
});
console.log(foWithMoList);

export const App = () => {
  const [type, setType] = useState('byFilter');
  const [state, setState] = useState(foWithMoList);
  const [variables, setVariables] = useState([
    {
      name: 'nasel',
      label: 'Численность населения, человек',
      selected: true
    },
    {
      name: 'ndd',
      label: 'Налогооблагаемые денежные доходы физических лиц и индивидуальных предпринимателей, тыс.рублей',
      selected: true
    },
    {
      name: 'svn',
      label: 'Социальные и другие выплаты, тыс. рублей',
      selected: true
    },
    {
      name: 'osvndd1',
      label: 'Объем социальных выплат населению и налогооблагаемых денежных доходов населения, тыс. рублей',
      selected: true
    },
    {
      name: 'osvndd2',
      label: 'Объем социальных выплат и налогооблагаемых денежных доходов населения в среднем на 1 жителя, рублей',
      selected: true
    }
  ]);
  const [allSelected, setAllSelected] = useState(true);

  const [contentToShow, setContentToShow] = useState({
    moList: '',
    variables: ''
  })

  return (
    <div>
      <h2>Загрузка данных по муниципальным образованиям</h2>
      <h3>Выберите наблюдения (муниципальные образования)</h3>
      {/*<button onClick={() => type !== 'byFilter' && setType('byFilter')}>
        По ФО и субъекту
      </button>
      <button onClick={() => type !== 'byName' && setType('byName')}>
        По коду ОКТМО или по названию МО
      </button>*/}
      {/*{type === 'byFilter' && <ByFilter allSelected={allSelected} setAllSelected={setAllSelected} state={state} setState={setState} />}*/}
      <ByFilter allSelected={allSelected} setAllSelected={setAllSelected} state={state} setState={setState} />
      {type === 'byName' && <ByName allSelected={allSelected} setAllSelected={setAllSelected} state={state} setState={setState} />}
      <Variables variables={variables} setVariables={setVariables}/>
      <button className='submit' onClick={() => {
        const moList = [];
        const variablesList = [];
        state.forEach(fo => fo.subjectsList.forEach(subject => subject.moList.forEach(mo => mo.selected && moList.push(mo.name))));
        variables.forEach(variable => variable.selected && variablesList.push(variable.label));
        setContentToShow({
          moList,
          variables: variablesList
        });
      }}>Загрузить</button>
      <div className="check-line-container">{(contentToShow.moList.length && contentToShow.moList.map(el => (<span>{el}</span>))) || null}</div>
      <div className="check-line-container">{(contentToShow.moList.length && contentToShow.variables.map(el => (<span>{el}</span>))) || null}</div>
    </div>
  );
}
