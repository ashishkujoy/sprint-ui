
const AnimationSpeedSelector = ({ animationSpeed, onSpeedChange }) => {
    const updateSpeed = ({target: {value}}) => {
        const speed = parseInt(value);
        if (speed > 0) {
            onSpeedChange(speed);
        }
    };

    return <div className='animation-speed'>
        <span>Animation Speed</span>
        <input type='number' min={1} value={animationSpeed} onChange={updateSpeed}></input>
    </div>
}

export default AnimationSpeedSelector;