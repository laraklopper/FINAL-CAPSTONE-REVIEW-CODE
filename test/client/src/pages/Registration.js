// Import necessary modules and packages
import React, { useState } from 'react';// Import the React module to use React functionalities
import '../CSS/registration.css'//Import CSS stylesheet
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
//Components
import MainHeader from '../components/MainHeader';//Import the MainHeader function component
import PageFooter from '../components/PageFooter';//Import the PageFooter function component
import RegistrationForm from '../components/RegistrationForm';//Import the RegistrationForm function component

//Registration Function Component
export default function Registration(//Export the default Registration component
  {//PROPS PASSED FROM PARENT COMPONENT
    setError
  }
  ) {
    //===============STATE VARIABLES=================
    // State to manage new user data
  const [newUserData, setNewUserData] = useState({
    newUsername: '',
    newEmail: '',
    newDateOfBirth: '',
    newAdmin: false,
    newPassword: '',
  });
  //==========REQUESTS========================
  //------------POST------------------------
     //Function to register a new user  
  const addUser = async () => {//Define an async function to register a new user
    try {
      const token = localStorage.getItem('token');// Retrieve token from localStorage
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',//HTTP reqeuest method
        mode: 'cors',//Enable CORS for Cross Origin Resource Sharing
        headers: {
          'Content-Type': 'application/json',//Specify the Content-Type in the payload as JSON
          'Authorization': `Bearer ${token}`// Attach the token in the Authorization header
        },
        body: JSON.stringify({
          username: newUserData.newUsername,
          email: newUserData.newEmail,
          dateOfBirth: newUserData.newDateOfBirth,
          admin: newUserData.newAdmin,
          password: newUserData.newPassword
        })
      });
      
      //Response handling
      if (response.ok) {
        // Clear new user data from state
        setNewUserData({
          newUsername: '',
          newEmail: '',
          newDateOfBirth: '',
          newAdmin: false,
          newPassword: ''
        });
        alert('New User successfully registered')//Notify the user of successful registration
      } else {
        // Handle errors if response is not successful
        // Attempt to parse the JSON error response from the server
        const errorData = await response.json(); 
        // Throw a new Error with the message from the server's response
        // If the server's response does not include a message, a default error message is used
        throw new Error(errorData.message || 'Error adding user');
      }
    } catch (error) {
      setError(`Error adding new user: ${error.message}`);// Set the error state to display the error in the UI
      console.error(`Error adding new user: ${error.message}`);//Log an error message in the console for debugging purposes
    }
  };
   
  //========JSX RENDERING=================

  return (
   <>
   {/* Header */}
   <MainHeader mainHeading='REGISTRATION'/>
   {/* Section1/ */}
   <section className='section1'>
        <Row className='regisRow'>
          <Col>
            <h3 className='h3'>ENTER REGISTRATION DETAILS</h3>
          </Col>
        </Row>
        {/* Regisrtration Form */}
        {/* Render the RegistrationForm component */}
    <RegistrationForm
    newUserData={newUserData}
    addUser={addUser}
    setNewUserData={setNewUserData}
    />
        
   </section>
   <section className='section2'>
        <Row>
          <Col xs={12} md={8}>
            <ul className='rulesList'>
              <li className='rule'>
                <h3 id='regisRequire'>REGISTRATION REQUIREMENTS:</h3>
                </li>
              <li className='rule'>
                THE USERNAME DOES NOT HAVE TO BE THE USERS REAL NAME
              </li>
              <li className='rule'>
                USERNAME AND PASSWORD MUST BE UNIQUE
              </li>
              <li className='rule'>
                PASSWORDS MUST BE AT LEAST 8 CHARACTERS
              </li>
              <li className='rule'>
                USERS MAY ONLY ON INITIAL REGISTRATION REGISTER AS AN
                ADMIN USER
              </li>
            </ul>
          </Col>
          <Col xs={6} md={4}>
          </Col>
        </Row>
   </section>
   {/* Footer */}
   <PageFooter/>
   </>
  )
}
