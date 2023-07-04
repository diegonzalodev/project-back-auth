class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create = async (ticketData) => {
    let result = await this.dao.create(ticketData);
    return result;
  }

  getById = async (ticketId) => {
    let result = await this.dao.getById(ticketId);
    return result;
  }

  update = async (ticketId, ticketData) => {
    let result = await this.dao.update(ticketId, ticketData);
    return result;
  }

  delete = async (ticketId) => {
    let result = await this.dao.delete(ticketId);
    return result;
  }
}

module.exports = TicketRepository;