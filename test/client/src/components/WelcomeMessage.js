import React from 'react'// Import the React module to use React functionalities
import Row from 'react-bootstrap/Row'; // Bootstrap Row component for layout
import Col from 'react-bootstrap/Col'; // Bootstrap Col component for layout

//Welcome message function component
export default function WelcomeMessage({currentUser}) {
  return (
    <Row className='welcomeRow'>
        <Col xs={6} className='welcomeCol'>
             <div id='welcomeMsg'>
                  <label id='welcomeLabel'>
                      <h2 id="welcomeHeading">WELCOME:</h2>
                      {/* Display current user's username */}
                      <h3 id="username">{currentUser?.username}</h3>
                  </label>
            </div>
        </Col>
        {/* Instructions */}
          <Col xs={6} id="instructions">
              <h2 id="instructionsHeading">HOW TO PLAY:</h2>
              {/* Explain how the application works */}
              <ul id="instructText">
                  <li className="instruction">
                      Select a quiz from the list
                  </li>
                  <li className="instruction">
                      Select the optional timer option
                  </li>
                  <li className="instruction">
                      Each quiz consists of 5 multiple choice questions
                  </li>
                  {/* <li className="instruction">
                  Users are not authorized to play quizzes they created
                </li> */}
              </ul>         
          </Col>
    </Row>
  )
}
