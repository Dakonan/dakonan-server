'use strict';
const { Model } = require('sequelize');
const { hash } = require('../helpers')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Sorry, someone else has registered this username"
      },
      validate: {
        notEmpty: {
          msg: "username cannot be empty"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Sorry, someone else has registered"
      },
      validate: {
        isEmail: {
          msg: "Please input the correct email format"
        },
        notEmpty: {
          msg: "Email cannot be empty"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password cannot be empty"
        },
        len: {
          args: [6, 1000],
          msg: "Password length must be at least 6"
        }
      }
    },
    matchCount: DataTypes.INTEGER,
    winCount: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate: instance => {
        instance.matchCount = 0
        instance.winCount = 0
        instance.password = hash(instance.password) 
      } 
    }, 
    sequelize,
    modelName: 'User',
  });
  return User;
};