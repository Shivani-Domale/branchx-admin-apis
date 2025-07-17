const Logger = require('../config/logger');


class crudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        try {
            const response = await this.model.create(data);
            return response;
        } catch (error) {
            throw new Error(`Error creating record: ${error.message}`);
        }
    }
    async findAll() {
        try {
            const response = await this.model.findAll();
            return response;
        } catch (error) {
            Logger.error("Error in findAll method in crud repository: ", error);
            throw error;
        }
    }

    async findByUserId(userId) {
        return await this.model.findAll({
            where: { userId }  // Make sure your `Campaign` table has a `userId` field
        });
    }

    async update(id, data) {
        try {
            const response = await this.model.update(data, {
                where: { id: id }
            });
            return response;
        } catch (error) {
            Logger.error("Error in update method in crud repository: ", error);
            throw error;
        }
    }

    async destroy(id) {
        try {
            const response = await this.model.destroy({
                where: { id: id }
            });
            return response;
        } catch (error) {
            Logger.error("Error in destroy method in crud repository: ", error);
            throw error;
        }
    }

    async findOne(where) {
        try {
            return await this.model.findOne({ where });
        } catch (error) {
            Logger.error("Error in findOne: ", error);
            throw error;
        }
    }


}

module.exports = crudRepository;