import '../index.css';

const AppHeader = ({ onHelpClick, modalOpen }) => {
    const className = modalOpen ? 'header disabled-screen' : 'header';
    return (<div className={className}>
        <div className='app-name'>Sprint simulator</div>
        <div className='help-section' onClick={onHelpClick} >Help</div>
    </div>)
}

export default AppHeader;
