// Import necessary modules and packages
import React from 'react'// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

//NewQuestionsList function component
export default function NewQuestionsList(
  {//PROPS PASSED FROM PARENT COMPONENT
    questions, 
    setQuestions,
    errorMessage,
addNewQuiz,
quizName,
setErrorMessage
  }
) {

  //============EVENT LISTENERS===================
  // Function to delete a question
  const deleteNewQuestion = (index) => {
    // Create a new array excluding the question at the specified index
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions) // Update the questions state with the new array
  }

  
// Function to handle form submission
const handleAddNewQuiz = async() => {
//Conditional rendering to check if the quiz name is provided and if there is at least one question
if ( !quizName || questions.length === 0) {
  setErrorMessage('Please enter a quiz name and add at least one question.'); // Display an error message
  return;//Exit early
}    
await addNewQuiz();// Call the addNewQuiz function
setErrorMessage('')// Clear any error messages after successful submission
};

  //===============JSX RENDERING===============
  return (
    <div id='newQuiz'>   
      {/* New Questions output */}
    <div className='newQuizOuput'>
        <Row className='quizNameRow'>
          <Col md={4} className='quizNameCol'>
            {/* NEW QUIZ NAME */}
            <h4 className='quizName'>QUIZ NAME: {quizName}</h4>
          </Col>
          <Col md={8}></Col>
        </Row>
        <Row className='newQuestionsRow'>
          <Col>
            {/* Display an error message if an error occurs */}
            {errorMessage && <div className="error">{errorMessage}</div>}
          </Col>  </Row>       
          {/* Map the list of new Questions */}
      {questions.map((q, index) => (
        <div className='questionsOutput' key={index}>
          <Row className='questionsRow'>
            <Col md={3} className='questionsCol'>
            {/* QUESTION */}
              <p className='questionOutput'>{q.questionText}</p>
            </Col>
            <Col md={2}>
            {/* CORRECT ANSWER */}
              <p className='answerOutput'>{q.correctAnswer}</p>
            </Col>
            <Col md={4}>
            {/* OPTIONS */}
              <p className='optionsOutput'>{Array.isArray(q.options) ? q.options.join(', ') : ''}</p>
            </Col>
            <Col md={3} id='newQuizBtnCol'>
            {/* Button to delete new question */}
              <Button
                variant='danger'
                id='newQuizBtn'
                type='button'
                onClick={() => deleteNewQuestion(index)}
                aria-label={`Delete Question ${index + 1}`}
              >
                DELETE QUESTION
              </Button>
            </Col>
          </Row>
        </div>
      ))}
      
        <Row id='addQuizBtnRow'>
          <Col md={8}></Col>
          {/* Button to add a new quiz */}
          <Col md={4} id='addQuizBtnCol'>
            <Button
              variant='primary'
              type='button'
              onClick={handleAddNewQuiz}
              aria-label='Add Quiz'
            >
              ADD QUIZ
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}
