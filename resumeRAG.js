require('dotenv').config();
const fs = require('fs');
const { OpenAI } = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const resumeText = fs.readFileSync('resume.txt', 'utf-8');


function splitToChunks(text) {
    // Split by double newlines (paragraph breaks)
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 50);
    
    const chunks = [];
    
    for (const para of paragraphs) {
        // If paragraph is too long, split further
        if (para.length > 1000) {
            const sentences = para.split(/[.!?]\s+/);
            let currentChunk = '';
            
            for (const sentence of sentences) {
                if ((currentChunk + sentence).length < 800) {
                    currentChunk += sentence + '. ';
                } else {
                    if (currentChunk.trim()) chunks.push(currentChunk.trim());
                    currentChunk = sentence + '. ';
                }
            }
            if (currentChunk.trim()) chunks.push(currentChunk.trim());
        } else {
            chunks.push(para.trim());
        }
    }
    
    return chunks;
}


//convert chunks to vector embeddings and store in pinecone
async function convertToVectorEmbeddings() {
    console.log('Starting indexing process...\n');

    const index = pc.index('resume-index');
    const chunks = splitToChunks(resumeText);

    console.log('Number of chunks:', chunks.length);

    for (let i = 0; i < chunks.length; i++) {
        console.log(`Processing chunk ${i + 1}/${chunks.length}...`);

        const embedding = await openai.embeddings.create({
            input: chunks[i],
            model: "text-embedding-3-small"
        });

        // Try the records property format (v7 might expect this)
        try {
            const result = await index.upsert({
                records: [
                    {
                        id: `chunk-${i}`,
                        values: embedding.data[0].embedding,
                        metadata: { text: chunks[i] }
                    }
                ]
            });
            console.log(`✅ Chunk ${i + 1} indexed successfully`);
        } catch (err) {
            console.error(`Failed on chunk ${i}:`, err.message);
            throw err;
        }
    }

    console.log("\n🎉 Finished converting to Vector Embeddings!\n");
}


//query the db
// Query the resume
async function query(question) {
    console.log(`\n🔍 Searching for: "${question}"\n`);
    
    const index = pc.index('resume-index');
    
    // Step 1: Convert question to embedding
    const questionEmbedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: question,
    });
    
    // Step 2: Search Pinecone for similar chunks
    const searchResults = await index.query({
        vector: questionEmbedding.data[0].embedding,
        topK: 10,
        includeMetadata: true
    });
    
    console.log(`Found ${searchResults.matches.length} relevant chunks\n`);
    
    // DEBUG: Show which chunks were retrieved
    console.log('=== RETRIEVED CHUNKS ===');
    searchResults.matches.forEach((match, i) => {
        console.log(`\nChunk ${i + 1} (score: ${match.score}):`);
        console.log(match.metadata.text.substring(0, 200) + '...');
    });
    console.log('\n========================\n');
    
    // Step 3: Extract text from results
    const context = searchResults.matches
        .map(match => match.metadata.text)
        .join('\n\n');
    
    // Step 4: Ask GPT with context
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant that answers questions about Ankitha's resume. When asked about 'current' or 'latest' company, look for the most recent dates (2024-Present or Oct 2024-Present). Answer based ONLY on the provided context."
            },
            {
                role: "user",
                content: `Context:\n${context}\n\nQuestion: ${question}`
            }
        ],
    });
    
    return completion.choices[0].message.content;
}

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    if (command === 'reset') {
        await deleteAndRecreateIndex();
    } else if (command === 'index') {
        await convertToVectorEmbeddings();
    } else if (command === 'query') {
        const question = args.slice(1).join(' ');
        if (!question) {
            console.log('Usage: node resumeRAG.js query "your question"');
            return;
        }
        const answer = await query(question);
        console.log('📝 Answer:\n');
        console.log(answer);
        console.log('\n');
    } else {
        console.log('Commands:');
        console.log('  node resumeRAG.js reset    - Delete and recreate index');
        console.log('  node resumeRAG.js index    - Index your resume');
        console.log('  node resumeRAG.js query "question"');
    }
}

main().catch(e => console.error(e));