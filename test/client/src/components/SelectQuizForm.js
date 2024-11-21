// Import necessary modules and components
import React from 'react';// Import the React module to use React functionalities
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Form from 'react-bootstrap/Form';// Import Col component from react-bootstrap
import FormHeaders from '../components/FormHeaders'; // Import form heading component

// SelectQuizForm function component
export default function SelectQuizForm(//Export the default SelectQuizForm function component
    {// PROPS PASSED FROM PARENT COMPONEN
    selectedQuizId,
    quizList,
    setSelectedQuizId
    }
) {

    //============EVENT LISTENERS===============
    // Function to handle quiz selection
    const handleSelectQuiz = (event) => {
        // Update selected quiz ID
        setSelectedQuizId(event.target.value);
    };

    //============JSX RENDERING==============
    return (
        <div id='selectQuizForm'>
            {/* Heading for quiz selection */}
            <FormHeaders formHeading='SELECT QUIZ' />
            <Row>
                <Col md={4}></Col>
                <Col xs={6} md={4} id='selectQuizCol'>
                    <label id='selectQuizLabel'>
                        <p className='labelText'>SELECT: </p>
                    </label>
                    {/* Form to select a quiz */}
                    <Form.Select
                        id='quizSelect'
                        value={selectedQuizId} 
                        onChange={handleSelectQuiz} 
                    >
                        {/* Default option prompting the user to select a quiz */}
                        <option value=''>Select a quiz</option>
                        {/* Map over the quizList array to create an option for each quiz */}
                        {quizList && quizList.length > 0 && quizList.map((quiz) => (
                            <option key={quiz._id} value={quiz._id} id='quizOption'>
                                {/* Display quiz name */}
                                {quiz.name}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
                <Col xs={6} md={4}></Col>
            </Row>
        </div>
    );
}
