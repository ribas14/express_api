const { check, validationResult } = require("express-validator");

function validateEmail() {
  return check("email")
    .exists()
    .withMessage("required field")
    .not()
    .isEmpty()
    .withMessage("empty param")
    .isEmail()
    .withMessage("Not a valid param");
}

function validateUsername() {
  return check("username")
    .exists()
    .withMessage("required field")
    .not()
    .isEmpty()
    .withMessage("empty param");
}

function validateAdminRights() {
  return check("admin")
    .exists()
    .withMessage("required field")
    .not()
    .isEmpty()
    .withMessage("empty param");
}

function validateIdExist() {
  return check("id")
    .exists()
    .withMessage("required field")
    .not()
    .isEmpty()
    .withMessage("empty param");
}

function validatePassword() {
  return check("password")
    .exists()
    .withMessage("required field")
    .not()
    .isEmpty()
    .withMessage("empty param");
}

exports.validateCreationUser = [
  validateEmail(),
  validateUsername(),
  validatePassword(),
  validateAdminRights()
];

exports.validateUpdataUser = [
  validateEmail(),
  validateUsername(),
  validateIdExist()
];
