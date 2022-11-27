import React from 'react'
import ScreenOverlay from '../ScreenOverlay'
import NewGameButton from '../Status/NewGameButton'

const GameOverOverlay = ({ playerName, score, opponentScore, onContitnue, newGame }) => {

    const title = score > opponentScore ? `${playerName} wins!` : `${playerName} loses!`

    return (
        <ScreenOverlay>
            <div style={{fontSize: 80}}>{title}</div>
            <div style={{fontSize: 48}}>{`${score} : ${opponentScore}`}</div>
            <button 
                type="button"
                className='continue-button'
                onClick={onContitnue}
            >
                <span>continue → </span>
            </button>
            <NewGameButton newGame={newGame} />
        </ScreenOverlay>
    )

}

export default GameOverOverlay