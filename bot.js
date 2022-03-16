const tmi = require('tmi.js');
const data = require('./opts');

// Create a client with our options
const client = new tmi.client(data.opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot

    // Remove whitespace from chat message
    const commandName = msg.trim();

    //console.log(target);
    //console.log(context);
    if(commandName.includes('hallo')) {
        client.say(target, `Hallihallo ${context['display-name']}, du Flauschi ❤`);
    }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}