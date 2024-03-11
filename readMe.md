# GPT-Discord-Bot

GPT-Discord-Bot is a Discord bot powered by OpenAI's GPT-3 model. It listens to messages in specified channels or messages that mention the bot, and generates responses using the OpenAI API.

## Setup

### Prerequisites

- Node.js and npm installed on your machine. You can check the installed versions by running `node -v` and `npm -v` in your terminal.
- An OpenAI API key. You can generate one from [OpenAI's platform](https://platform.openai.com/api/key-generation).
- A Discord bot token. You can create a new bot on the [Discord Developer Portal](https://discord.com/developers/applications).

### Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory in your terminal.
3. Run `npm init -y` to initialize a new Node.js project.
4. Run `npm install discord.js dotenv openai` to install the necessary dependencies.
5. Create a `.env` file in the root of your project and add your OpenAI API key and Discord bot token like so:

    ```
    OPENAI_KEY=your_openai_key
    TOKEN=your_discord_bot_token
    CHANNEL_ID=your_discord_channel_id
    ```

### Running the Bot

1. Run `node index.js` in your terminal to start the bot.
2. The bot should now be online and ready to respond to messages in the specified channel or messages that mention the bot.

## Usage

The bot listens for new messages in the specified channel or messages that mention the bot. It ignores messages from other bots and messages that start with the `!` prefix. When a new message is received, the bot sends the conversation history to the OpenAI API to generate a response, and then sends the response back in the Discord channel.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the terms of the MIT license.