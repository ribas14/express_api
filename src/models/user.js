const user = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pic: {
      type: DataTypes.STRING
    }
  });

  User.associate = models => {
    User.hasMany(models.Message);
    User.hasMany(models.Category);
  };

  User.findByLogin = async login => {
    let user = await User.findOne({
      where: { username: login }
    });
    if (!user) {
      user = await User.findOne({
        where: { email: login }
      });
    }
  };

  return User;
};
export default user;
