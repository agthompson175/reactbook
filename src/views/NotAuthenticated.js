import React from 'react'

export const NotAuthenticated = () => {
    return (
        <React.Fragment>
            <h3>Unauthorized</h3>
            <hr />
            <p>You must be logged in to view this page.</p>
        </React.Fragment>
    )
}