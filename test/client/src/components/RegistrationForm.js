// Import necessary modules and packages
import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

//RegistrationForm function component
export default function RegistrationForm(//Export the default RegistrationForm component
    {//PROPS PASSED FROM PARENT COMPONENT
    newUserData, 
    addUser,
    setNewUserData
 }
) {

  //============EVENT LISTENERS=================    
    //Function handle user registration
  const handleRegistration = (e) => {
    e.preventDefault();//Prevent default form submission
    console.log('Registering new user');
    addUser(); //Call the addUser function
  }
    
  //Function to handle input change
  const handleInputChange = (event) => {
    // Extract the properties from the event.target
    const { name, value, type, checked } = event.target;
    // Determine the new value based on the input type
    // If the input type is 'checkbox', use `checked`, otherwise use `value`
    const newValue = type === 'checkbox' ? checked : value;
    // Spread the previous state and update the specific field based on `name`
    setNewUserData(prevState => (
      { ...prevState, [name]: newValue }));
  };

//=========JSX RENDERING===========

  return (
    // Registration form
    <form id='registrationForm' onSubmit={handleRegistration}>
          <Row className='regisRow'>
              <Col xs={6} md={4} className='regisCol'>
              {/* New Username Input */}
                  <label className='regisLabel'>
                    <p className='labelText'>USERNAME:</p>
                    <input
                    className='regisInput'
                    type='text'
                    name='newUsername'
                    value={newUserData.newUsername}
                    onChange={handleInputChange}
                    placeholder='USERNAME'
                    autoComplete='off'
                    required
                    />
                  </label>
              </Col>
              <Col xs={6} md={4} className='regisCol'>
              {/* New Email Input */}
                  <label className='regisLabel'>
                      <p className='labelText'>EMAIL:</p>
                      <input
                          className='regisInput'
                          type='email'
                          name='newEmail'
                          value={newUserData.newEmail}
                          onChange={handleInputChange}
                          placeholder='Enter Email'
                          autoComplete='off'
                          required
                           />
                  </label>
              </Col>
              <Col xs={6} md={4} className='regisCol'>
                  <label className='regisLabel'>
                    {/* New Date of Birth Input */}
                      <p className='labelText'>DATE OF BIRTH:</p>
                      <input
                          className='regisInput' 
                          type='date'
                          name='newDateOfBirth'
                          value={newUserData.newDateOfBirth}
                          onChange={handleInputChange}
                          placeholder='dd/mm/yyyy'
                          required
                          
                          />
                  </label>
              </Col>
          </Row>
          <Row className='regisRow'>
              <Col xs={6} md={4} className='regisCol'>
                  {/* New Password Input */}
                  <label className='regisLabel'>
                      <p className='labelText'>PASSWORD:</p>
                      {/*Password middleware*/}
                      <input
                          className='regisInput' 
                          type='password'
                          name='newPassword'
                          value={newUserData.newPassword}
                          onChange={handleInputChange}
                          placeholder='Password'
                          autoComplete='current-password'
                          required
                          />
                  </label>
              </Col>
              <Col xs={6} md={4} className='regisCol'>
                  {/* Admin Input */}
                  <label id='regisLabelCheckBox'>
                      <p className='labelText'>REGISTER AS ADMIN:</p>
                      <input
                          id="adminCheckBox"
                          type='checkbox'
                          checked={newUserData.newAdmin}
                          onChange={handleInputChange}
                          name='newAdmin'
                      />
                  </label>
              </Col>
              <Col xs={6} md={4} className='regisCol'>
                  {/* Registration Button */}
                  <Button 
                  variant="primary"
                  type='submit' 
                  id='registrationBtn'>
                    REGISTER
                  </Button>
              </Col>
          </Row>
    </form>
  )
}
