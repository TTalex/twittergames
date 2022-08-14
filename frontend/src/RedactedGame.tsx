import React, {useState, useEffect} from 'react';
import './RedactedGame.css';
import {Container, Row, Col, Form, Button, Alert} from 'react-bootstrap';
import Tweet from './Components/Tweet'

type Tweets = {
    data?: any[],
    answer?: string,
    includes?: {
        users: any[]
    },
    rawdata?: any[]
}
export default function RedactedGame(){
    const [tweets, setTweets] = useState({} as Tweets);
    const [numberOfDisplayedTweets, setNumberOfDisplayedTweets] = useState(1);
    const [guess, setGuess] = useState("")
    const [state, setState] = useState("")
    const getTweets = () => {
        fetch("http://" + window.location.hostname + ":4000/api/redact")
        .then(res => res.json())
        .then(
            (result) => {
                console.log('result', result);
                setTweets(result);
            },
            (error) => {
                console.log("fetch api error", error);
            }
        )
    }
    useEffect(getTweets , [])
    const handleSubmit = (e:any) => {
        e.preventDefault()
        if (guess === tweets.answer) {
            setState("victory")
        } else {
            if (numberOfDisplayedTweets === 10) {
                setState("lost")
            } else {
                setState("fail")
                setNumberOfDisplayedTweets(p => p+1)
            }
        }
    }
    const restartGame = () => {
        setNumberOfDisplayedTweets(1)
        setState("")
        setGuess("")
        getTweets()
    }
    return (
        <Container>
            <Row>
                <Col><h1 style={{margin: "20px"}}>Redacted twitter</h1></Col>
            </Row>
            {state === "fail" && <Alert variant="warning">
                No.. the word was not {guess}, adding one more tweet
            </Alert>}
            {state === "lost" && <Alert variant="danger">
                Sorry, you didn't guess it, the word was <b>{tweets.answer}</b>
            </Alert>}
            {state === "victory" && <Alert variant="success">
                Congratulations, you found the correct word !
            </Alert>}
            <Row className="justify-content-md-center">
                <Col lg="4">
                    {state !== "lost" && state !== "victory" ? <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Type your guess ({tweets?.answer?.length || 0} letters)</Form.Label>
                            <Form.Control type="text" value={guess} onChange={e => {setState(""); setGuess(e.target.value)}}/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                    : <Button variant="primary" onClick={restartGame}>
                        Restart
                    </Button>
                    }
                </Col>
            </Row>
            <Row>
                {state !== "lost" && state !== "victory" && tweets.data && tweets.data.slice(0, numberOfDisplayedTweets).map((tweet, index) => <Col lg="6"  key={index}><Tweet tweet={tweet} author={tweets?.includes?.users?.[index]} /></Col>).reverse()}
                {(state === "lost" || state === "victory") && tweets.rawdata && tweets.rawdata.slice(0, numberOfDisplayedTweets).map((tweet, index) => <Col lg="6" key={index}><Tweet tweet={tweet} author={tweets?.includes?.users?.[index]} /></Col>).reverse()}
            </Row>
        </Container>
    )
}
