import '../styles/label.css';

const LabelToCellPositionMapping = (props) => {
    const labels = Object.entries(props.labels || {});

    if (labels.length < 18) {
        const emptyLabels = new Array(18 - labels.length).fill(null);
        emptyLabels.forEach(_ => labels.push([null, null]));
    }


    return <div className="label-to-cell-pos" style={{
        maxHeight: '100px',
        overflow: 'scroll',
        maxWidth: '1780px'
    }}>
        <table>
            <tbody>
                <tr>
                    <th className='boxed'>Label</th>
                    {labels.map(([label], i) => <td key={`${label ? label : i}`} className='boxed'>{label}</td>)}
                </tr>
                <tr>
                    <th className='boxed'>Cell Number</th>
                    {labels.map(([_, labelValue], i) => <td key={`${labelValue ? `${labelValue}` : `value-${i}`}`} className='boxed' >{labelValue}</td>)}
                </tr>
            </tbody>
        </table>
    </div>
}

export default LabelToCellPositionMapping;