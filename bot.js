#!/usr/bin/node

const discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');

const client = new discord.Client();

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

client.on('ready', () => {
    logger.info('Connected');
});

client.on('messageUpdate', (oldMessage, newMessage) => {
    if(oldMessage.channel.name == "counting") {
        newMessage.delete();
    }
});

client.on('message', message => {

    var channel = message.channel;
    
    if(channel.name == "counting") {
        
        if(message.attachments.size != 0) {
            logger.info("Attachments, deleting msg.");
            message.delete();
        }

        channel.messages.fetch({
            limit: 2
        }).then(messages => {
    
            if(messages.size == 1) {
                
                var first = messages.first();
                
                if(first.content != '1') {
                    logger.info("First msg is not 1, deleting msg.");
                    first.delete();
                }

            } else {
                
                var first = messages.first(); //newer
                var last = messages.last();
                
                if(isNaN(first.content)) {
                    logger.info("Not a number, deleting msg.");
                    first.delete();
                    return;
                }

                if(first.author == last.author) {
                    logger.info("Same author, deleting msg.");
                    first.delete();
                    return;
                }

                if(parseInt(first.content) != parseInt(last.content) + 1) {
                    logger.info("Not i++, deleting msg.");
                    first.delete();
                    return;
                }
            }
        });
    }
});

client.login(auth.token);
