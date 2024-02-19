const Sequelize = require('sequelize');

const sequelize = new Sequelize('group-chat', 'root', 'Kunal@1234de', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;