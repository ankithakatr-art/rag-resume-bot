import { faArrowRightLong, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useRef, useEffect } from 'react';


export default function TextContainer() {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<{
        origin: string; text: string, id: string
    }[]>([]);
    const messagesRef = useRef<HTMLDivElement>(null);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };


    const generateUUID = () => {
        return crypto.randomUUID();
    }

    const handleTextSubmit = () => {

        setIsLoading(true)
        setText('');

        setMessages(prev => [...prev, { origin: 'user', text: text, id: generateUUID() }]);

        fetch('/resume/question', {
            method: 'POST',
            body: JSON.stringify({ "question": text }),
            headers: {
                "Content-Type": "application/JSON",
            },
        }).then(response => response.json())
            .then(res => {
                setMessages(prev => [...prev, { origin: 'bot', text: res.answer, id: generateUUID() }]);
            })
            .catch(() => {
                setMessages(prev => [...prev, {
                    origin: 'error',
                    text: 'Failed to get response. Please try again.',
                    id: generateUUID()
                }]);
            })
            .finally(() => setIsLoading(false));

    };

    const handleEnterKey = (event: any) => {

        if (event.key === 'Enter') {
            handleTextSubmit();
        }
    };

    const scrollToBottom = () => {
        if (messagesRef.current) {
            messagesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    return (
        <div className='parent-container'>
            <div className='container1'>
                <input className='text-container' type="text" onChange={handleTextChange} value={text} onKeyDown={handleEnterKey} />

                <button className="enter-button" disabled={isLoading || text.length < 3} onClick={handleTextSubmit}>
                    <FontAwesomeIcon icon={faArrowRightLong} />
                </button>

            </div>
            <div className='messages-container'>
                {isLoading && <FontAwesomeIcon className='icon-spin fa-2x' icon={faSpinner} />}
                {messages.map(x => {
                    return (
                        <div key={x.id}>
                            <p className={x?.origin === 'user' ? 'question-container' : x?.origin === 'error' ? 'error-message' : 'response-container'}>{x.text}</p>
                        </div>
                    );
                })}
            </div>
            <div ref={messagesRef} />
        </div>
    );
}