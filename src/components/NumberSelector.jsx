
const NumberSelector = ({ value, onChange, title, min }) => {
    const updateValue = ({ target: { value } }) => {
        const val = parseInt(value);
        if (val > 0) {
            onChange(val);
        }
    };

    return <div className='animation-speed'>
        <span>{title}</span>
        <input type='number' min={min} value={value} onChange={updateValue}></input>
    </div>
}

export default NumberSelector;