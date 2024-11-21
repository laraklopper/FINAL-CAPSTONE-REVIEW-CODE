import React, { useCallback, useState } from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

// Result function component
export default function Result(//Export default Result function component
  {// PROPS PASSED FROM PARENT COMPONENT
  currentScore,
  addScore,
  quizName,
  totalQuestions,
  currentUser,  
}
) {
  //===========STATE VARIABLES=================
  const [showScore, setShowScore] = useState(true);// State to control the visibility of the result display
  const [submitted, setSubmitted] = useState(false)//Boolean to indicate if the score has been submitted
  const [submissionError, setSubmissionError] = useState(null)//State to indicate if an error occured while submitting the score

  //--------------EVENT LISTENERS---------------
  // Function to submit score
  const handleSubmitScore = useCallback( async (e) => {
    e.preventDefault()
    setSubmitted(true); // Indicate submission in progress
    setSubmissionError(null); // Clear previous errors
    try {
      await addScore(); // Call the addScore function 
      console.log(currentScore);//Log the current score in the database for debugging purposes
      setShowScore(false)
    } catch (error) {
      setSubmissionError('Failed to save score');
      console.error('Failed to save score', error.message);//Log an error message for debugging purposes
    }
    finally{
      setSubmitted(false)// Reset submission state on failure
    }
  },[addScore, currentScore]);

// console.log(quizName)

   // Function to display the current date format
  const currentDate = () => {
    const options = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      timeZone: 'Europe/Bucharest'
     };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date());
    // return new Date().toLocaleDateString('en-GB', options);
  };
  //=============JSX RENDERING=================

  return (
    showScore && (
      <div id='results'>
        <form onSubmit={handleSubmitScore}>
          <Row>
            <Col xs={6} md={4}>
            {/* Display the quizName */}
              <input
                value={quizName || 'Unnamed Quiz'}
              readOnly
              type='text'
                className='resultFormInput'
              />
            </Col>
            <Col xs={6} md={4}>
              {/* Display the username of the user */}
              <input
                id='quizUser'
                className='resultFormInput'
                type='text'
                value={`Username: ${currentUser?.username || ''}`}
                readOnly
              />
            </Col>
            <Col xs={6} md={4} id='resultsCol'>
              {/* Display the result with the score and total questions */}
              <input
                id='resultOutput'
                className='resultFormInput'
                type='text'//Input type
                value={`RESULT: ${currentScore} OF ${totalQuestions}`}
                readOnly
              />
            </Col>
            <Col xs={6} md={4} className='resultsCol'>             
            </Col>
          </Row>
          <Row>
            <Col xs={6} md={4}>
             <input
                type='text'
                value={currentDate()}
                name='date'
                readOnly
                className='resultFormInput'
              />
            </Col>
            <Col xs={6} md={4}></Col>
          </Row> 
          <Row>
            <Col xs={6} md={4} className='resultFormCol'></Col>
            <Col xs={6} md={4} id='saveScoreBtnCol'>
              {/* Button to submit the score */}
              <Button
                variant='primary'
                type='submit'
                id='saveScoreBtn'
                disabled={submitted}
              >
                {submitted ? 'Submitting...' : 'SAVE SCORE AND EXIT'}              
              </Button>
            </Col>
            <Col xs={6} md={4} className='resultFormCol'></Col>
          </Row>
        </form>
          {/* Display error message if an error 
          occurs when the score is submitted */}
        {submissionError && <p>{submissionError}</p>}
        <Row>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4}>
            {/* Button to exit when the quiz is 
            complete or the user saved the score*/}
            {/* <Button variant='warning' onClick={handleExit}
              type='button'
            >
              Exit
            </Button> */}
          </Col>
          <Col xs={6} md={4}></Col>
        </Row>
      </div>
    )
    )}
  

