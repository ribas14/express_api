import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => {
  const categories = await req.context.models.Category.findAll();
  return res.send(categories);
});

router.get("/:categoryId", async (req, res) => {
  const category = await req.context.models.Category.findByPk(
    req.params.categoryId
  );
  return res.send(category);
});

router.post("/", async (req, res) => {
  const user = await req.context.models.User.findByPk(req.body.userId);
  if (user) {
    try {
      const category = await req.context.models.Category.create({
        category: req.body.category,
        userId: req.body.userId
      });
      return res.send(category);
    } catch (error) {
      return res.status(500).send("Category already exist!");
    }
  } else {
    return res.status(500).send("User does not exist!");
  }
});

router.delete("/:categoryId", async (req, res) => {
  const result = await req.context.models.Category.destroy({
    where: { id: req.params.categoryId }
  });
  return res.send(true);
});
export default router;
