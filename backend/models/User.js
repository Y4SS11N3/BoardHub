const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const bcrypt = require('bcryptjs');

class User extends Model {
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
}

User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  language: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'English (US)'
  },
  accountType: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Student'
  },
  betaFeatures: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  keyboardShortcuts: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  followers: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  following: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  }
}, {
  sequelize,
  modelName: 'User',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

module.exports = User;