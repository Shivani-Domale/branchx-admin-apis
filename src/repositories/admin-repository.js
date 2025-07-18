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
  async fechAdminProfile(id) {
    try {
      const response = await this.model.findByPk(id, {
        attributes: ['name', 'email', 'phone', 'address', 'state', 'city', 'country', 'role', 'profile_url']
      });
      return response;
    } catch (error) {
      Logger.error("Error in findById method in crud repository: ", error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const response = await this.model.findByPk(id);
      return response;
    } catch (error) {
      Logger.error("Error in findById method in crud repository: ", error);
      throw error;
    }
  }

  async findByEmail(email) {
    return await this.model.findOne({ where: { email } });
  }


}

module.exports = AdminRepository;
