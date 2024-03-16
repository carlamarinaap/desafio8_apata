import MessageSchema from "../models/message.schema.js";

class MessageManager {
  getMessages = async () => {
    try {
      return await MessageSchema.find();
    } catch (error) {
      throw new Error(`Hubo un error obteniendo los mensajes`);
    }
  };

  addMessage = async (message) => {
    try {
      await MessageSchema.create(message);
    } catch (error) {
      throw new Error(`Hubo un error cargando el mensaje`);
    }
  };
  clearChat = async () => {
    try {
      await MessageSchema.deleteMany();
    } catch (error) {
      throw new Error(`Hubo un error eliminando el chat`);
    }
  };
}

export default MessageManager;
