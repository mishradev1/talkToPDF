import { streamText } from 'ai';
import OpenAI from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Validate the input payload
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid messages payload" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await streamText({
      model: 'gpt-4',
      api: openai,
      messages,
      system: 'You are a helpful assistant.',
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in API handler:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


  
// import { NextRequest } from 'next/server';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // Ensure this is set
// });

// export const runtime = 'edge';

// export async function POST(req: NextRequest) {
//   try {
//     const { messages, chatId } = await req.json();

//     // Validate inputs
//     if (!messages || !Array.isArray(messages)) {
//       return new Response(
//         JSON.stringify({ error: 'Invalid request: messages must be an array.' }),
//         { status: 400, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     // Log for debugging
//     console.log('Incoming Chat ID:', chatId);
//     console.log('Incoming Messages:', messages);

//     // Stream response from OpenAI
//     const completion = await openai.chat.completions.create({
//       model: 'gpt-4',
//       messages,
//       stream: true,
//     });

//     return new Response(JSON.stringify({ response: completion.choices[0].message.content }), {
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error processing request:', error);
//     return new Response(
//       JSON.stringify({ error: 'Internal Server Error', details: error.message }),
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     );
//   }
// }
