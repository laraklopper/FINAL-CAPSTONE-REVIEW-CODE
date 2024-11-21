// Import necessary modules and packages
import React from 'react';// Import the React module to use React functionalities
// Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

//LoginForm function component
export default function LoginForm({//Export default LoginForm function component
  //PROPS PASSED FROM PARENT COMPONENT
    setUserData, 
    userData,
    setShowPassword, 
    showPassword, 
    submitLogin
  }) 
  {

  //============EVENT LISTENERS===============
  //Function for handling user login data changes
  const handleUserLogin = (event) => {
    const { name, value } = event.target;
    // Update userData state with new values
    setUserData((prevState) => (
      { ...prevState, [name]: value }// Spread previous state and update the specific field
    ));
  };

    // Function to handle user Login
    const handleLogin = (e) => {
      e.preventDefault()// Prevent  defualt form submissione
      // console.log('logging In');//Log a message in the console for debugging purposes
      submitLogin();// Call the submitLogin function
    }

  //============JSX RENDERING================

  return (
    // Form for user login
    <form id='loginForm' onSubmit={handleLogin}>
      <div id='loginDetails'>
      <Row className='loginRow'>
        <Col className='loginCol'>
          {/* Username input */}
          <label className='loginLabel' htmlFor='loginUsername'>
              {/* Label for the username input field */}
            <p className='labelText'>USERNAME:</p>
              {/* Input field for username */}
              <input
                className='loginInput'
                type='text'
                name='username'
                value={userData.username}
                onChange={handleUserLogin}
                autoComplete='off'
                placeholder='USERNAME'
                id='loginUsername'
              />
          </label>
        </Col>
      </Row>
      <Row className='loginRow'>
        <Col className='loginCol'>
          {/* Password Input */}
          <label className='loginLabel' htmlFor='loginPassword'>
              {/* Label for the password input field */}
            <p className='labelText'>PASSWORD:</p>
              {/* Input field for password */}
            <input
                className='loginInput'
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={userData.password}
                onChange={handleUserLogin}
                autoComplete='off'
                placeholder='PASSWORD'
            />
            <div id='showPassword'>   
             {/* Button to display password */}
              <Button variant='success' type='button' id='passwordDisplay'
                // Toggle password visibility state
                  onClick={() => setShowPassword(!showPassword)}>
                  {/* Button text based on visibility state*/}
                  {showPassword ? 'HIDE PASSWORD' : 'SHOW PASSWORD'} 
                </Button>
              </div>
          </label>
        </Col>
      </Row>
        {/* Row for login button */}
      <Row className='loginRow'>
        <Col className='loginCol'>
          {/* Login Button */}
          <Button variant="primary" id='loginBtn' type='submit'>
            LOGIN
          </Button>
        </Col>  
      </Row>
      </div> 
    </form>
  )
}
