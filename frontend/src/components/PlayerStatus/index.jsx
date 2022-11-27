import React from 'react'

const PlayerStatus = ({ isPlayerOneOnline, isPlayerTwoOnline }) => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 40,
                left: 40,
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: 8
            }}
        >
            <div>
                <Dot isOnline={isPlayerOneOnline} />
                player 1
            </div>
            <div>
                <Dot isOnline={isPlayerTwoOnline} />
                player 2
            </div>
        </div>
    )
}

const Dot = ({ isOnline }) => {

    return <div 
        style={{
            backgroundColor: isOnline ? 'green' : 'transparent',
            border: '2px solid black',
            borderRadius: '100%',
            width: 12,
            height: 12,
            display: 'inline-block',
            marginRight: 12
        }}
    >
    </div>
}

export default PlayerStatus