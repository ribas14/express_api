import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => {
  const products = await req.context.models.Product.findAll();
  return res.send(products);
});

router.get("/:productId", async (req, res) => {
  const product = await req.context.models.Product.findByPk(
    req.params.messageId
  );
  return res.send(product);
});

router.post("/", async (req, res) => {
  const product = await req.context.models.Product.create({
    text: req.body.text,
    userId: req.context.me.id
  });
  return res.send(product);
});

router.delete("/:productId", async (req, res) => {
  const result = await req.context.models.Product.destroy({
    where: { id: req.params.productId }
  });
  return res.send(true);
});
export default router;
