const category = (sequelize, DataTypes) => {
  const Category = sequelize.define("category", {
    category: {
      type: DataTypes.STRING,
      unique: true
    },
    slug: {
      type: DataTypes.STRING
    },
    pic: {
      type: DataTypes.STRING
    }
  });

  Category.associate = models => {
    Category.belongsTo(models.User);
    Category.hasMany(models.Product);
  };

  return Category;
};

export default category;
