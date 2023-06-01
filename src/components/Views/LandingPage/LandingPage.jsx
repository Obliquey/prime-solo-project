import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";

function LandingPage() {
    const history = useHistory();
    const user = useSelector(store => store.user)

    return (
        <div className="grid grid-cols-1 place-items-center space-y-3 m-auto mt-28">
            <p className="text-4xl text-white font-semibold">StuMP3d</p>
            <img className="w-72 h-auto" src="https://www.freepnglogos.com/uploads/play-button-png/circular-play-button-svg-png-icon-download-onlinewebfontsm-30.png"/>
            <div className="grid grid-cols-1 space-y-2">
                {
                    user.id ? <button className="border border-black p-2 rounded-full bg-purple-600 text-white"
                    onClick={() => history.push('/login')}>Play</button> 
                    :
                    <button 
                    className="border border-black p-2 rounded-full bg-purple-600 text-white"
                    onClick={() => history.push('/login')}
                    >Login or Register</button>
                }
                <button 
                className="border border-black p-2 rounded-full bg-purple-600 text-white"
                onClick={() => history.push('/about')}
                >How To Play</button>
            </div>
        </div>
    )
}

export default LandingPage;