import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import NewGameButton from "./NewGameButton";
import shipImg1 from '../../assets/img/ship1.png';
import shipImg2 from '../../assets/img/ship2.png';
import shipImg3 from '../../assets/img/ship3.png';
import shipImg4 from '../../assets/img/ship4.png';
import shipImg5 from '../../assets/img/ship5.png';
import discoveredShipImg1 from '../../assets/img/discovered_ship1.png';
import discoveredShipImg2 from '../../assets/img/discovered_ship2.png';
import discoveredShipImg3 from '../../assets/img/discovered_ship3.png';
import discoveredShipImg4 from '../../assets/img/discovered_ship4.png';
import discoveredShipImg5 from '../../assets/img/discovered_ship5.png';
import './style.css';

const StatusBoard = ({ score, newGame }) => {
    const [selectedEmoji, setSelectedEmoji] = useState({ id: 1, activeStyle: true });
    const shipInfos = [
        {
            discovered: discoveredShipImg1,
            nondiscovered: shipImg1
        },
        {
            discovered: discoveredShipImg2,
            nondiscovered: shipImg2
        },
        {
            discovered: discoveredShipImg3,
            nondiscovered: shipImg3
        },
        {
            discovered: discoveredShipImg4,
            nondiscovered: shipImg4
        },
        {
            discovered: discoveredShipImg5,
            nondiscovered: shipImg5
        }
    ];
    const discoveredShip = [false, false, true, false, true];
    const emojis = [`🤫`, `🤩`, `😡`, `😥`];
    useEffect(() => {
        setTimeout(() => setSelectedEmoji({ id: selectedEmoji.id, activeStyle: !selectedEmoji.activeStyle }), 1000);
    }, [selectedEmoji]);
    return (
        <div className="game-status-container">
            <div className="game-status-wrapper">
                <div 
                    style={{
                        width: '100%',
                        height: '50%',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-evenly'
                    }}
                >
                    <div style={{fontSize: 32}}>Score</div>
                    <div style={{fontSize: 48}}>{score}</div>
                </div>
                <div className="emoji-container">
                    {
                        emojis.map((item, i) => {
                            return (
                                <span key={i} className={`emoji-span ${(selectedEmoji.id === i && selectedEmoji.activeStyle) && `active`}`} role="img" aria-label="sheep">{item}</span>
                            )
                        })
                    }
                </div>
            </div>
            <NewGameButton {...{ newGame }} />
        </div>
    )
}

export default StatusBoard;