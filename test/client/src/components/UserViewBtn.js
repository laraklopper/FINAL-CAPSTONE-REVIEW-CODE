// Import necessary modules and packages
import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

// UserViewBtn component
export default function UserViewBtn(
    { // PROPS PASSED FROM PARENT COMPONENT
        toggleViewUsers, 
        viewingUsers,
        isUnauthorized 
    }
    ) {
    
    //========JSX RENDERING==========

    return (
        <Col>
            {/* Button to toggle the display of all users */}
            <Button
                // Change button variant based on viewingUsers state
                variant={isUnauthorized  ? 'danger': (viewingUsers ? 'secondary' : 'primary')}
                type='button' // Specify the button type
                onClick={toggleViewUsers} // Attach the click event handler
                id='userDisplayBtn'// Set the button ID
                >
                {/* Button text changes based on viewingUsers state */}
                {isUnauthorized ? 'UNAUTHORIZED' : (viewingUsers ? 'HIDE USERS' : 'VIEW USERS')}                
            </Button>
        </Col>
    );
}
