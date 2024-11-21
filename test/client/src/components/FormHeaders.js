// Import necessary modules and packages
import React from 'react'// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap

//Form Headers function component
export default function FormHeaders(
    {formHeading}//Props
) {

    //==========JSX RENDERING===========
  return (
    <Row className='formHeaderRow'>
      <Col className='formHeaderCol' md={12}>
      {/* Form heading */}
        <h2 id='formHeading'>{formHeading}</h2>
      </Col>
    </Row>
  )
}
