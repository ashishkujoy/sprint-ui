import '../styles/label.css';

const LabelToCellPositionMapping = (props) => {
    const labels = props.labels || {};
    const labelNames = Object.keys(labels);
    const labelValues = labelNames.map(label => labels[label]);

    if (labelNames.length < 18) {
        const emptyLabels = new Array(18 - labelNames.length).fill(null);
        emptyLabels.forEach(empty => {
            labelNames.push(empty);
            labelValues.push(empty);
        });
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
                    {labelNames.map((label, i) => <td key={`${label ? label : i}`} className='boxed'>{label}</td>)}
                </tr>
                <tr>
                    <th className='boxed'>Cell Number</th>
                    {labelValues.map((labelValue, i) => <td key={`${labelValue ? `${labelValue}` : `value-${i}`}`} className='boxed' >{labelValue}</td>)}
                </tr>
            </tbody>
        </table>
    </div>
}

export default LabelToCellPositionMapping;