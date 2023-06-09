import React from 'react';
import LogOutButton from '../../FunctionComponents/LogOutButton/LogOutButton';
import {useSelector, useDispatch} from 'react-redux';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


// * This component will be the display of all the User's info, like current streak and current score, song history etc.
function UserPage() {
  const user = useSelector((store) => store.user);
  const userScore = useSelector((store) => store.userScore);
  const userHistory = useSelector(store => store.userHistory)
  const dispatch = useDispatch();
  const history = useHistory();
  
  // will need a useEffect to proc a dispatch upon page load
  useEffect(() => {
    // dispatch will call to Saga to get the user's history + current score and streak
    dispatch({
      type: 'GET_HISTORY'
    })
    dispatch({type:'FETCH_SCORE'})
  }, [])
  
  // need to make sure my scores are updated
  const updateUserScores = () => {
  }
  
  // click handler to take the player back to the playPage + clear out the reducers
  const playAgain = () => {
    dispatch({
      type: 'EMPTY_PREVIEWS',
      payload: []
    });
    dispatch({
        type: 'EMPTY_ALBUM',
        payload: []
    })
    dispatch({
        type: 'CLEAR_SONGS_ARRIVED',
        payload: 'false'
    })
    history.push('/playPage');
  }
  
  // function to delete a specific history item
  const deleteItem = (id) => {
    dispatch({
      type: 'DELETE_HISTORY_ITEM',
      payload: id
    })
    dispatch({type:'GET_HISTORY'})
  }


  return (
    <div className="grid grid-cols-1 space-x-12 gap-x-1 order justify-center">
      {/* User Info + current streak, current score, etc */}
      <div 
      className='m-auto mt-2 mb-12 h-auto p-10 pt-8 pb-8 outline outline-double outline-offset-8 outline-8 outline-purple-300 
      border-8 border-purple-400 rounded-3xl text-center bg-white w-auto p-12 space-y-8'
      >
        <p className='text-4xl mb-12 font-mono'>{user.username}</p>
        <p className='font-mono'>Score: {userScore.score}</p>
        <p className='font-mono'>Streak: {userScore.streak}</p>
        <button onClick={playAgain} className='border-inherit rounded-full p-2 bg-purple-700 m-2 text-white font-medium'>Play Again</button>
      </div>

      {/* their history, last ten songs listened to */}
      {/* Might want to make this it's own component */}
      <div className='m-auto mt-2 border-8 rounded-3xl border-purple-400 outline outline-double outline-offset-8 outline-8 outline-purple-300' id='histTable'>
        <table className='content-center m-3 w-auto border border-black overflow-auto'>
          <thead>
            <tr>
              <th scope="col" className="text-sm text-white border bg-slate-700 border border-r-0 border-black p-1 uppercase font-thin font-mono">Song</th>
              <th scope="col" className="text-sm text-white border bg-slate-700 border border-x-0 border-black p-1 uppercase font-thin font-mono">Artist</th>
              <th scope="col" className="text-sm text-white border bg-slate-700 border border-x-0 border-black p-1 uppercase font-thin font-mono">Album</th>
              {/* Don't think I'll be needing the release date, but I'll leave it commented out here just in case I want it again someday */}
              {/* <th scope="col" className="text-sm text-white border bg-slate-700 border border-x-0 border-black p-1 uppercase font-thin font-mono">Released</th> */}
              <th scope="col" className="text-sm text-white border bg-slate-700 border border-x-0 border-black p-1 uppercase font-thin font-mono">Guess</th>
              <th scope="col" className="text-sm text-white border bg-slate-700 border border-l-0 border-black p-1 uppercase font-thin font-mono pr-2">Delete</th>
            </tr>
          </thead>
          <tbody>
              {
                  userHistory.map(item => {
                    return (
                      <tr className="" key={userHistory.indexOf(item)}>
                        <td scope="row" className="bg-slate-600 text-white text-xs text-center border-b border-dotted border-slate-800 p-1">{item.song_name}</td>
                        <td scope="row" className="bg-slate-600 text-white text-xs text-center border-b border-dotted border-slate-800 p-1">{item.artist}</td>
                        <td className='bg-slate-600 text-white text-xs text-center border-b border-dotted border-slate-800 p-1'><img src={item.cover_art}/></td>
                        {/* Don't think I'll be needing the release date, but I'll leave it commented out here just in case I want it again someday */}
                        {/* <td scope="row" className="bg-slate-600 text-white text-xs text-center border-b border-dotted border-slate-800 p-1">{item.year_released}</td> */}
                        <td scope="row" className="bg-slate-600 text-white text-xs text-center border-b border-dotted border-slate-800 p-1">{!item.correctly_guessed ? <p>Incorrect</p> : <p>Correct</p>}</td>
                        <td className='text-center bg-slate-600 text-red-400 text-md text-center border-b border-dotted border-slate-800 p-1'><button onClick={() => deleteItem(item.id)}>X</button></td>
                      </tr>
                    )
                  })
                }
          </tbody>
        </table>
      </div>
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;


//  * this was the table I cribbed at first, doesn't work on mobile-first layout vvvv
{/* <div className="relative overflow-x-auto m-auto">
        <p className='text-xl underline italic text-center text-white font-mono'>History</p>
        <table className="w-auto border-spacing-1 h-1 m-auto text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-white uppercase bg-gray-500 dark:text-white">
            <tr>
              <th scope="col" className="px-6 py-3">Song</th>
              <th scope="col" className="px-6 py-3">Artist</th>
              <th scope="col" className="px-6 py-3">Album</th>
              <th scope="col" className="px-6 py-3">Released</th>
              <th scope="col" className="px-6 py-3">Guess</th>
              <th scope="col" className="px-6 py-3">Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              userHistory.map(item => {
                return (
                  <tr className="bg-white border-b dark:bg-gray-600 dark:border-gray-700 h-2" key={userHistory.indexOf(item)}>
                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.song_name}</td>
                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.artist}</td>
                    <td><img src={item.cover_art}/></td>
                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.year_released}</td>
                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{!item.correctly_guessed ? <p>Incorrect</p> : <p>Correct</p>}</td>
                    <td className='text-center'><button onClick={() => deleteItem(item.id)}>X</button></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div> */}