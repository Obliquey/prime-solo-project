import { useEffect } from "react";
import { LinearProgress } from "@mui/material";



// *This component will pretty much only contain the spotify login link. However, it would be nice to have a check where, 
// *if the user has already previously given Spotify authorization, then it redirects them to the PlayPage
function SpotifyLogin() {

    useEffect(() => {
        clickLink();
    }, [])

    // this isn't a great solution, it's too slow
    const clickLink = () => {
        document.getElementById('spotifyLink').click();
        console.log("Does my click() work?");
    }
    return(
        <div className="text-center text-2xl text-white m-auto mt-72">
            <a 
            id="spotifyLink" 
            href="https://frozen-plateau-32043.herokuapp.com/api/spotifyOAuth/login">AUTHORIZING WITH SPOTIFY</a>
            <LinearProgress color="secondary" />
        </div>
    )
}

export default SpotifyLogin;