import express from 'express'
import http from 'http'
import cors from 'cors'
import redact from './redact'

const app = express()
const server = http.createServer(app);

app.use(cors())
app.use(express.static('frontend/build'))

app.get('/api/redact', async (req, res) => {
    const tweetData = await redact.get("en")
    res.json(tweetData)
})

server.listen(4000, () => {
    console.log('listening on *:4000');
});
