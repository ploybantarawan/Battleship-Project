import React from 'react'

const ScreenOverlay = ({ children }) => {

    return (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                position: 'fixed',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4rem',
                zIndex: 100,
                color: 'white',
                backdropFilter: 'blur(4px)'
            }}
        >
            {children}
        </div>
    )

}

export default ScreenOverlay