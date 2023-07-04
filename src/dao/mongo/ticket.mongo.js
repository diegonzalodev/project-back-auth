const { ticketModel } = require("../../models/ticket.model");

class TicketDaoMongo {
  async create(ticketData) {
    try {
      const ticket = new ticketModel(ticketData);
      const createdTicket = await ticket.save();
      return createdTicket;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(ticketId) {
    try {
      const ticket = await ticketModel.findById(ticketId);
      return ticket;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(ticketId, ticketData) {
    try {
      const updatedTicket = await ticketModel.findByIdAndUpdate(ticketId, ticketData, {
        new: true,
      });
      return updatedTicket;
    } catch (error) {
      throw new Error(error);
    }
  }

  async delete(ticketId) {
    try {
      await ticketModel.findByIdAndDelete(ticketId);
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = TicketDaoMongo;
