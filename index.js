require('dotenv').config();
const { OpenAI } = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

async function test() {
    console.log("Testing OpenAI....");

    //open ai testing
    const chatResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Say hello!" }],
    });
    console.log('OpenAI works:', chatResponse.choices[0].message.content);

    //embedding test
    const embedding = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: "This is a test",
    });
    console.log('Embeddings work! Length:', embedding.data[0].embedding.length);

    // Test Pinecone connection
    const index = pinecone.index('resume-index');
    const stats = await index.describeIndexStats();
    console.log('Pinecone connected! Total vectors:', stats.totalRecordCount);

    console.log('\nAll systems working!\n');
};

test().catch(console.error);