const router = require("express").Router();
const authRouter = require("../modules/auth/auth.router")
const userRouter = require("../modules/user/user.router")
const bannerRouter = require("../modules/banners/banner.router")
const brandRouter = require("../modules/brands/brand.router")
const categoryRouter = require("../modules/categories/category.router")
const cartRouter = require("../modules/carts/cart.router")
const productRouter = require("../modules/product/product.router")
const OrderRouter = require("../modules/order/order.router")


router.use("/auth",authRouter)
router.use("/user", userRouter)
router.use("/banner", bannerRouter)
router.use("/brand", brandRouter)
router.use("/category", categoryRouter)
router.use("/cart", cartRouter)
router.use("/product", productRouter)
router.use("/order", OrderRouter)

module.exports = router;