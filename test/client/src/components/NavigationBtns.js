// Import necessary modules and packages
import React, { useCallback } from 'react'// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

export default function NavigationBtns(
    {//PROPS PASSED FROM PARENT COMPONENT
        quiz,
        currentQuestionIndex,
        setCurrentQuestionIndex

    }) {
    //========EVENT LISTENERS==========
    //Function to handle navigation between questions
    const handleNavigation = useCallback((direction) => {
        if (!quiz.questions || !Array.isArray(quiz.questions)) {
            console.error('Quiz questions are not properly defined.');
        }
        if (direction === 'previous') {
            if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(prevIndex => prevIndex - 1);
            } else {
                console.log('You are already at the first question.');
            }
        } else if(direction === 'next'){
            if (currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            } else {
                console.log('You are already at the last question');
            }
        }
    },[currentQuestionIndex, quiz.questions, setCurrentQuestionIndex])

    //========JSX RENDERING=============
  return (
    <Row className='editQuizRow'>
        {/* Navigation buttons */}
          <Col  md={6}></Col>
          <Col md={3} className='editQuizCol' id='prevQuesBtnCol'>
              {/* Button to move to previous question */}
              <Button
                  variant='secondary'
                  onClick={() => handleNavigation('previous')}
                  className='prevQuestionBtn'
                  type='button'
                  aria-label='previous question'
                  disabled={currentQuestionIndex === 0}
              >
                  PREVIOUS QUESTION
              </Button>
          </Col>
          <Col md={3} className='editQuizCol' id='nextQuesBtnCol'>
          {/* Button to move to next question */}
              <Button 
              variant="primary" 
              type='button'
              className='nextQuestionBtn'
              onClick={() => handleNavigation('next')}
              disabled={currentQuestionIndex === quiz.questions.length - 1}
              >
                NEXT QUESTION
            </Button>
          </Col>
    </Row>
  )
}
