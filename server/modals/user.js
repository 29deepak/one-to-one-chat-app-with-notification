const Sequelize = require('sequelize');

const sequelize = require('../utils/database');
const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
    },
    password: Sequelize.STRING,
    isAvatarImageSet: {
        type: Sequelize.BOOLEAN
    },
    avatarImage: {
        type: Sequelize.TEXT
    }

});

module.exports = User;