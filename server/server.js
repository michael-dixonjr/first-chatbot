import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

//a function that can accept an object in which the key is passed to
const configuration = new Configuration ({
    apiKey: process.env.OPENAI_API_KEY,
})

//new instance of OPENAI
const openai = new OpenAIApi(configuration);

//initializing express application
const app = express();
app.use(cors({origin:"*"})); //allows use of cross origin requests, so the server can be called from the frontend
app.use(express.json());//allows json to be passed from the frontend to the backend

//dummy route, receives data from the frontend
app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hey its working',
    })
});

//post allowing body and payload
app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.7, // Higher values means the model will take more risks.
            max_tokens: 500, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
            top_p: 1, // alternative to sampling with temperature, called nucleus sampling
            frequency_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
            presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
        });
        
        res.status(200).send({
            bot: response.data.choices[0].text,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error})
    }
})

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));