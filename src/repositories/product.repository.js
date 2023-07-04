class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create = async (newProduct) => {
    let result = await this.dao.create(newProduct);
    return result;
  }

  getAll = async () => {
    let result = await this.dao.getAll();
    return result;
  }

  getById = async (pid) => {
    let result = await this.dao.getById(pid);
    return result;
  }

  update = async (pid, updatedProduct) => {
    let result = await this.dao.update(pid, updatedProduct);
    return result;
  }

  delete = async (pid) => {
    let result = await this.dao.delete(pid);
    return result;
  }

  getPaginated = async (options) => {
    let result = await this.dao.getPaginated(options);
    return result;
  }
}

module.exports = ProductRepository;