// Import necessary modules and packages
import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap 
import FormHeaders from './FormHeaders';

//Edit User function component
export default function EditUser(//Export the edit user function component
  {//PROPS PASSED FROM PARENT COMPONENT 
        editUserData, 
        handleInputChange, 
        editUser
    }
){

  //=========EVENT LISTENERS================
  // Function to handle form submission
  const handleUpdate = (e) => {
    e.preventDefault()//Prevent default form submission 
    console.log('Edit user account');//Log a message in the console for debugging purposes
    editUser()//Call the editUser function
  }
  
    //===================JSX RENDERING===============
    
  return (
        <div id='editAccount'>
          <FormHeaders formHeading='EDIT ACCOUNT'/>
          {/* Form to edit user account */}
          <form onSubmit={handleUpdate} id='editUserForm'>
            <Row className='editUserRow'>
              <Col xs={6} className='editUserCol'>
              {/* New username input */}
              <label className='editUserLabel'>
                <p className='labelText'>USERNAME:</p>
                <input
                  type='text'
                  name='editUsername'
                  value={editUserData.editUsername}
                  onChange={handleInputChange}
                  autoComplete='off'
                  placeholder='New Username'
                  className='editUserInput'
                />
              </label>
              </Col>
              {/* New user email input */}
              <Col xs={6} className='editUserCol'> <label className='editUserLabel'>
                <p className='labelText'>EMAIL:</p>
                <input
                  type='email'
                  name='editUserEmail'
                  value={editUserData.editUserEmail}
                  onChange={handleInputChange}
                  autoComplete='off'
                  placeholder='New Email'
                  className='editUserInput'
                />
              </label>
              </Col>
            </Row>
              <Row className='editUserBtnRow'>
                  <Col xs={12} md={8}></Col>
                  <Col xs={6} md={4} className='editUserBtnCol'>
                  
                      <Button 
                      variant="warning" 
                      type='submit'
                      id='editAccountBtn'
                      >
                        EDIT ACCOUNT
                        </Button>
                  </Col>
              </Row>
          </form>
        </div>
  )
}
