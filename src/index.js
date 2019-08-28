import "dotenv/config";
import cors from "cors";
import express from "express";
import models, { sequelize } from "./models";
import routes from "./routes";

const app = express();
const eraseDatabaseOnSync = true;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(async (req, res, next) => {
  req.context = {
    models,
    me: await models.User.findByLogin("ddavids")
  };
  next();
});

// Routes
app.use("/session", routes.session);
app.use("/users", routes.user);
app.use("/categories", routes.category);
app.use("/products", routes.product);
app.use("/messages", routes.message);

sequelize.sync({ force: eraseDatabaseOnSync }).then(() => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }
  0;
  app.listen(process.env.PORT, () => {
    console.log("listening 1337 port");
  });
});

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: "ddavids",
      email: "ddavids@gmail.com",
      password: "324324324",
      admin: true,
      messages: [
        {
          text: "Happy to release ..."
        },
        {
          text: "Published a complete ..."
        }
      ]
    },
    {
      include: [models.Message]
    }
  );
  await models.User.create(
    {
      username: "rwieruch",
      password: "324324324",
      admin: false,
      email: "rwieruch@gmail.com",
      messages: [
        {
          text: "Published the Road to learn React"
        }
      ]
    },
    {
      include: [models.Message]
    }
  );
  await models.Category.create(
    {
      userId: 1,
      category: "Fruits",
      products: [
        {
          product: "Banana"
        },
        {
          product: "Apple"
        },
        {
          product: "Orange"
        }
      ]
    },
    {
      include: [models.Product]
    }
  );
  await models.Category.create(
    {
      userId: 2,
      category: "Drinks",
      products: [
        {
          product: "Coca"
        },
        {
          product: "Pepsi"
        },
        {
          product: "Water"
        }
      ]
    },
    {
      include: [models.Product]
    }
  );
};
