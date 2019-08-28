const product = (sequelize, DataTypes) => {
  const Product = sequelize.define("product", {
    product: {
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
  Product.associate = models => {
    Product.belongsTo(models.Category, { onDelete: "CASCADE" });
  };
  return Product;
};
export default product;
