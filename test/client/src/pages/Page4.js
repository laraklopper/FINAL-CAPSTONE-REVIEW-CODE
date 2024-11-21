// Import necessary modules and packages
import React, { useState } from 'react';// Import the React module to use React functionalities
import '../CSS/Page4.css';//Import CSS stylesheet
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

//Components
import Header from '../components/Header';//Import the Header function component
import EditUser from '../components/EditUser';//Import the EditUser function component
import Footer from '../components/Footer';//Import the Footer function component
import UserViewBtn from '../components/UserViewBtn';//Import the UserViewBtn function component

// Page 4 function component
export default function Page4({//Export default Page4 function component
  // PROPS PASSED FROM PARENT COMPONENT
  logout, 
  currentUser, 
  setUsers, 
  setLoggedIn, 
  setError, 
  users
}) {
  //===========STATE VARIABLES===============
  const [editUserData, setEditUserData] = useState({ // State for user edit form data
    editUsername: '',
    editUserEmail: ''
  });
  const [updateUser, setUpdateUser] = useState(null);  // State for tracking which user's details are being updated
  const [viewUsers, setViewUsers] = useState(false);// State for toggling user list visibility
  const [isUnauthorized, setIsUnauthorized] = useState(false); // State for userView authorisation access

  //---------------------------------------

  // Function to specify the date format
  const dateDisplay = (dateString) => {
    // Define the format options for day, month, and year
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    // Convert the input date string to a Date object and format it using the options
    return new Date(dateString).toLocaleDateString('en-GB', options);
  }

  //======REQUESTS===============
  //--------PUT---------------
  // Function to edit a user 
  const editUser = async (userId) => {//Define an async funcion to edit User details
    try {
      const token = localStorage.getItem('token');//Retrieve the JWT token from localStorage
      //Conditional rendering to check if the JWT token is found
      if (!token) {
        throw new Error('No token available');//Throw an error message if no token is available 
      }
      // Send PUT request to the server to update user details
      const response = await fetch(`http://localhost:3001/users/editAccount/${userId}`, {
        method: 'PUT',//HTTP request method
        mode: 'cors',// Enable Cross-origin resource sharing
        headers: {
          'Content-Type': 'application/json',//Specify the Content-Type in the payload as JSON
          'Authorization': `Bearer ${token}`,// Attach the token in the Authorization header 
        },
        body: JSON.stringify({
          username: editUserData.editUsername,// Updated username
          email: editUserData.editUserEmail,// Updated email
        })
      });

      //Response handling
      // Conditional rendering to check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error('Failed to update user account');// Throw an error if response is not OK
      }
      const updatedAccount = await response.json(); // Parse the updated account data from the response

      // Update the list of users in the state with the modified user details
      setUsers((prevUsers) =>
        prevUsers.map((user) => user._id === userId ? updatedAccount : user)
      );

      // Reset the edit form data and close the update form
      setEditUserData({ editUsername: '', editUserEmail: '' });
      setUpdateUser(null);
      setLoggedIn(true);// Optionally, refresh user login status

      console.log('User account successfully updated');// Log success message in the console for debugging purposes
    } catch (error) {
      console.error(`Error updating user account: ${error.message}`);//Log an error message in the console for debugging purposes
      setError(`Error updating user account: ${error.message}`);// Set the error state to display the error in the UI
    }
  };

  //-----------DELETE----------------------
  // Function to remove a user
  const deleteUser = async (userId) => {//Define an async function to delete a user
    try {
      const token = localStorage.getItem('token')
      // Send a DELETE request to server
      const response = await fetch(`http://localhost:3001/users/deleteUser/${userId}`, {
        method: 'DELETE',//HTTP request method
        mode: 'cors',//Enable Cross-Origin resource sharing
        headers: {
          'Content-type': 'application/json',//Specify the Content-Type in the payload as JSON
          'Authorization': `bearer ${token}`,// Attach the token in the Authorization header
        },
      });

      // Conditional rendering if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error('Failed to remove user');// Throw an error if the DELETE request is unsuccessful
      }
      // Update the user list in the state to remove the deleted user
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userId)
      );
      console.log('User Successfully removed');// Log a success message in the console for debugging purposes

    } catch (error) {
      setError('Error removing user', error);// Set the error state to display the error in the UI
      console.error('Error removing user:', error.message);//Log an error message in the console for debugging purposes
    }
  };

  //==========EVENT LISTENERS=============
  // Function to handle input change in the update form
  const handleInputChange = (event) => {
    // Extract name and value from the event target
    const { name, value } = event.target;
    setEditUserData((prevData) => ({
      ...prevData,
      [name]: value, // Update the property based on the input name
    }));
  };

  // Function to toggle the update form
  const updateAccount = (userId) => {
    // Toggle the current update form based on userId
    // If the current userId matches the state, set it to null (hide form)
    // Otherwise, set the state to the new userId (show form)
    setUpdateUser(userId === updateUser ? null : userId);
  };

  /* Function to toggle the display users list if 
     the current user is an admin user */
  const toggleViewUsers = () => {
    /* Conditional rendering to check if the 
    current user is an admin user*/
    if (currentUser.admin) {
      setIsUnauthorized(false);// Reset unauthorized state
      setViewUsers(!viewUsers);// Toggle the visibility of the user list
    } 
    else {
      console.log('Unauthorized');//Log a message in the console for debugging purposes
      alert('Unauthorized');//Notify the user
      setIsUnauthorized(true); // Set unauthorized state
    }
  };

  //=======JSX RENDERING==================

  return (
    <>
      {/* Header */}
      <Header heading='USER ACCOUNT' />
      <section className="page4Section1">
        {/* Current User output */}
        {currentUser && (
          <div id='currentUserOutput'>
            <Row className='userOutputRow'>
              <Col id='userHeadCol'>
              <h2 id='userAccountHead'>USER DETAILS</h2></Col>
            </Row>
            <Row className='userOutputRow'>
              <Col xs={6} md={4} className='userOutputCol'>
                {/* Current user username */}
                <div className='userData'>
                <p className='outputText'>USERNAME: {currentUser.username}</p></div>
              </Col>
              <Col xs={6} md={4} className='userOutputCol'>
                {/* Current user email */}
                <div className='userData'>
                <p className='outputText'>EMAIL: {currentUser.email}</p>
                </div>
              </Col>
              <Col xs={6} md={4} className='userOutputCol'>
                {/* Current user Date of Birth */}
                <div className='userData'>
                  <p className='outputText'>
                    DATE OF BIRTH: {dateDisplay(currentUser.dateOfBirth)}
                  </p>
                </div>             
              </Col>
            </Row>
            <Row className='userOutputRow'>
              <Col xs={6} md={4} className='userOutputCol'>
                {/* Output to state if the current user is an admin user */}
                <div className='userData'>                
                  <p className='outputText'>ADMIN: {currentUser.admin ? 'Yes' : 'No'}</p>
                </div>
              </Col>
              <Col xs={6} md={4} className='userOutputCol'></Col>
              <Col xs={6} md={4} id='toggleEditUserCol'>
                {/* Button to toggle the update User details */}
                <Button
                  variant="warning"
                  type='button'
                  id='toggleUserEditBtn'
                  onClick={() => updateAccount(currentUser._id)}>
                  {updateUser === currentUser._id ? 'EXIT' : 'EDIT'}
                </Button>
              </Col>
            </Row>
            {updateUser === currentUser._id && (
              <div id='editUser'>
                {/* EditUser form */}
                <EditUser
                  editUserData={editUserData}
                  handleInputChange={handleInputChange}
                  editUser={() => editUser(currentUser._id)}
                />
              </div>
            )}
          </div>
        )}
      </section>
      {/* Section 2*/}
      <section className='section2'>
        <div>
          {/* Display all USERS */}
          <Row>
            <UserViewBtn 
              toggleViewUsers={toggleViewUsers}
              viewingUsers={viewUsers}
              isUnauthorized={isUnauthorized}
            />
          </Row>
          {viewUsers && (
            <div id='usersList'>
              <Row>
                <Col>
                  <h2 className='h2'>USERS</h2>
                </Col>
              </Row>
              {/* User Output */}
              {users.map((user) => (
                <div key={user._id} className='user'>
                  <Row>
                    <Col xs={6} className='userDataCol'>
                      {/* Username output */}
                      <p className='outputText'>USERNAME: {user.username}</p>
                    </Col>
                    <Col xs={6} className='userDataCol'>
                      {/* Email output */}
                      <p className='outputText'>EMAIL: {user.email}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6} className='userDataCol'>
                      {/* Date of Birth output */}
                      <p className='outputText'>DATE OF BIRTH: {dateDisplay(user.dateOfBirth)}</p>
                    </Col>
                    <Col xs={6} className='userDataCol'>
                      {/* Button to delete user */}
                      <Button
                        variant='danger'
                        type='button'
                        onClick={() => deleteUser(user._id)}
                        className='deleteUserBtn'
                        >
                        REMOVE USER
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Page Footer */}
      <Footer logout={logout}/>
    </>
  );
}
