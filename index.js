// Load environment variables from .env file
require(`dotenv/config`);

// Import the Client class from the discord.js module
const { Client } = require(`discord.js`);

// Import the OpenAI class from the openai module
const { OpenAI } = require(`openai`);

// Create a new instance of the Client class
const client = new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent']
});

// Event listener for when the bot is ready
client.on('ready', () => {
    console.log('Bot online')
});

// Prefix for commands to ignore
const IGNORE_PREFIX = "!";

// Array of channel IDs where the bot should respond
const CHANNELS = [process.env.CHANNEL_ID];

// Create a new instance of the OpenAI class
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

// Event listener for when a message is created
client.on('messageCreate', async (message) => {

    // Ignore messages from bot
    if (message.author.bot) return;

    // Ignore messages that start with the ignore prefix
    if (message.content.startsWith(IGNORE_PREFIX)) return;

    // Ignore messages that are not in the specified channels and do not mention the bot
    if (!CHANNELS.includes(message.channelId) && !message.mentions.users.has(client.user.id)) return;

    // Send a typing indicator
    await  message.channel.sendTyping();

    // Keep sending a typing indicator every 5 seconds
    const sendTypingInterval = setInterval(() => {
        message.channel.sendTyping();
    }, 5000);

    // Initialize the conversation array
    let conversation = [];
    conversation.push({
        role: 'system',
        content: 'CHAT GPT bot',
    });

    // Fetch the last 10 messages in the channe
    let prevMessages = await message.channel.messages.fetch({ limit: 10 });
    prevMessages.reverse();

    // Add each message to the conversation array
    prevMessages.forEach((msg) => {

        // Ignore messages from bots that are not this bot
        if (msg.author.bot && msg.author.id !== client.user.id) return;

        // Ignore messages that start with the ignore prefix
        if (msg.content.startsWith(IGNORE_PREFIX)) return;

        // Replace spaces and non-word characters in the username
        const userName = msg.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');

        // Add the bot's messages as assistant messages
        if (msg.author.id === client.user.id) {
            conversation.push({
                role: 'assistant',
                name: userName,
                content: msg.content,
            });

            return;
        }

        // Add other messages as user messages
        conversation.push({
            role: 'user',
            name: userName,
            content: msg.content,
        })
    });

    // Send the conversation to the OpenAI API and get a response
    const response = await openai.chat.completions
        .create({
            model: 'gpt-3.5-turbo',
            messages: conversation,
        }).catch((error) => console.error('OpenAI Error:\n', error));

    // Stop sending the typing indicator
    clearInterval(sendTypingInterval);

    // If there was an error with the OpenAI API, send a message
    if (!response) {
        message.reply("Trouble with OpenAI api. Try again")
        return;
    };

    // Get the content of the response message
    const responseMessage = response.choices[0].message.content;
    const chunkSizeLimit = 2000;

    // Send the response message in chunks of 2000 characters
    for (let i = 0; i < responseMessage.length; i+= chunkSizeLimit) {
        const chunk = responseMessage.substring(i, i + chunkSizeLimit);

        await message.reply(chunk);

    };
});

// Log in to Discord with the bot's token
client.login(process.env.TOKEN);