const router = require("express").Router();
const userCtrl = require("./user.controller");
// const userController = require("./user.controller");
const logincheck = require("../../middlewares/auth.middleware");
const hasPermission = require("../../middlewares/rbac.middleware");
const {
  setPath,
  uploader,
  uploadFile,
} = require("../../middlewares/uploader.middleware");
const { FileFilterType } = require("../../config/constant.config");
const { bodyValidator } = require("../../middlewares/validator.middleware");
const {
  selfChecker,
  selfcartchecker,
} = require("../../middlewares/selfChecker.middleware");
const { UserCreateDTO } = require("./user.request");
// create user
// data receive from front end
// data validation
// fail => respond
// data manipulate
// password => admin 123 ==> encrypt
//connect db
//db select
// db store
//fail -> respond
// db sucess
// email(optional)

router.use(logincheck); //yo lekyo vaney "tala" ko sabbai ma implement hunxa  , yo vanda mathi ko ma middle ware jadaina

router
  .route("/")
  // .post(hasPermission,uploader.none(),userCtrl.userCreate)
  // .post(hasPermission,uploader.single('image'),userCtrl.userCreate)
  // .post(hasPermission,uploader.array('image'),userCtrl.userCreate)
  .post(
    hasPermission("admin"),
    setPath("user"),
    uploadFile().single(FileFilterType.IMAGE),
    bodyValidator(UserCreateDTO),
    userCtrl.userCreate
  )
  .get(hasPermission("admin"), userCtrl.userLists);

router
  .route("/:id")
  .get(hasPermission("admin",'customer','seller'),selfChecker, userCtrl.userListbyid)

  .patch(selfChecker, userCtrl.userUpdatebyid)
  .delete(hasPermission(["admin", "seller", "customer"]),selfChecker,userCtrl.userDeletebyid );

// .put(hasPermission('admin'),userCtrl.userUpdatebyid)
// .put(hasPermission(['admin','seller','customer']),selfChecker,userCtrl.userUpdatebyid)

// .delete(hasPermission('admin'),userCtrl.userDeletebyid)
// .delete(hasPermission(['admin','seller','customer']),selfChecker,userCtrl.userDeletebyid)

module.exports = router;
