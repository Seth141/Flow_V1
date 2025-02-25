const openai = require('./openaiClient');

module.exports.generateChatResponse = async (message) => {
  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'You are a software engineering assistant named Ebb. Your goal is to provide detailed answers with well-written code examples when appropriate. Analyze user questions carefully and ask follow-up questions when necessary.',
      },
      { role: 'user', content: message },
    ],
  });
  return chatCompletion.choices[0].message.content;
};
