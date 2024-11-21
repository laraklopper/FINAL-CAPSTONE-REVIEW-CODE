// Import necessary modules and packages
import React from 'react'// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap

//PageFooter function component
export default function PageFooter() {//Export default PageFooter component
  
    //=====JSX RENDERING===========
  return (
    // PageFooter
    <footer className='pageFooter'>
          <Row className='rulesRow'>
              <Col xs={12} md={8} className='rulesCol'>      
          <ul className='rulesList'>
            <li><h3 className='rulesHeading'>RULES:</h3></li>
            <li className='ruleItem'>
              <h6 className='rule'>
                ALL ADMIN USERS MUST BE OLDER THAN 18
              </h6>
            </li>
            <li className='ruleItem'>
              <h6 className='rule'>
                THE APPLICATION DOES NOT SUPPORT ANY FORM OF GAMBLING
              </h6>
            </li>
            <li>
              <h6 className='rule'>
                USER INFORMATION IS PRIVATE AND MAY NOT BE ACCESSED
                WITHOUT AUTHORIZATION
              </h6>
            </li>
            <li className='ruleItem'>
              <h5 className='rule'>
                ANY USER WHO DOES NOT ADHERE TO THESE RULES MAY BE REMOVED
              </h5>
            </li>
          </ul>
              </Col>
              <Col xs={6} md={4} className='rulesCol'>
              </Col>
          </Row>        
    </footer>
  )
}
