// Import necessary modules and packages
import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

// Footer function component
export default function Footer(//Export default footer function component
  {//PROPS PASSED FROM PARENT COMPONENT
    logout
  }) {

  //==============JSX RENDERING=============

  return (
    <footer className='pageFooter'>
      <Row className='footerRow'>
        <Col></Col>
      </Row>
          <Row className='logoutRow'>
              <Col xs={12} md={8}></Col>
              <Col xs={6} md={4} className='logoutCol'>             
              {/* Logout button */}
                <Button 
                  variant="warning" 
                  type='button' 
                  id='logoutBtn'
                  onClick={logout}
                  >
                    LOGOUT
                  </Button>          
              </Col>
          </Row>
    </footer> 
  )
}
