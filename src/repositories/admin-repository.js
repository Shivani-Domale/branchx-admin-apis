const { Admin } = require('../models');
const CrudRepository = require('./crud-repository');

class AdminRepository extends CrudRepository {
  constructor() {
    super(Admin);
  }

  async findByEmail(email) {
    return await this.model.findOne({ where: { email } });
  }

  async findByEmailAndToken(email, token) {
    return await this.model.findOne({ where: { email, resetToken: token } });
  }

  async createAdmin(adminData) {
    return await this.create(adminData); // from crudRepository
  }

  async updateAdmin(adminInstance, updateData) {
    return await adminInstance.update(updateData);
  }
}

module.exports =  AdminRepository;
