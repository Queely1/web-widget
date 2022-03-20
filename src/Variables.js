import {CheckBoxLine} from "./helpers";

export const Variables = ({ variables, setVariables }) => {
    const onChange = (ind) => (e) => {
        setVariables(prevVariables => prevVariables.map((curVariable, curInd) => ({
            ...curVariable,
            selected: curInd === ind ? e.target.checked : curVariable.selected
        })))
    };

    return (
        <>
           <h3>Выберите переменные</h3>
            <div className="check-line-container">
                {variables.map((variable, ind) => (
                    <CheckBoxLine
                        selected={variable.selected}
                        text={variable.label}
                        onClick={onChange(ind)}
                    />
                ))}
            </div>
        </>
    );
};