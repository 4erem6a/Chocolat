export default (client, oldMessage, newMessage) => {
    if (newMessage.author.bot || newMessage.system) {
        return;
    }
    if (oldMessage.content == newMessage.content || !newMessage.content) {
        return;
    }
    client.emit("commandMessage", newMessage);
};