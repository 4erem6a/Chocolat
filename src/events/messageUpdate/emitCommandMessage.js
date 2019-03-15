export default (client, oldMessage, newMessage) => {
    if (oldMessage.content == newMessage.content || !newMessage.content) {
        return;
    }
    client.emit("commandMessage", newMessage);
};