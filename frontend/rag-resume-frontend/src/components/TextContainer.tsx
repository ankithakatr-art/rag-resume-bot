import { faArrowRightLong, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';


export default function TextContainer() {
    const [text, setText] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const handleTextSubmit = () => {

        setIsLoading(true)

        fetch('http://localhost:3003/resume/question', {
            method: 'POST',
            body: JSON.stringify({ "question": text }),
            headers: {
                "Content-Type": "application/JSON",
            },
        }).then(response => response.json())
            .then(res => {
                console.log('frontend:', res.answer);
                setResponse(res.answer);
            })
            .catch(err => console.error('Error submitting text:', err))
            .finally(() => setIsLoading(false));

    };

    return (
        <div className='parent-container'>
            <div className='container1'>
                <input className='text-container' type="text" onChange={handleTextChange} value={text} />

                <button className="enter-button" disabled={isLoading || text.length < 3} onClick={handleTextSubmit}>
                    <FontAwesomeIcon icon={faArrowRightLong} />
                </button>

            </div>
            <div className=''>
                {isLoading && <FontAwesomeIcon className='icon-spin fa-2x' icon={faSpinner} />}
                {response && <p className='response-container'>{response}</p>}
            </div>
        </div>
    );
}