const { body } = require("express-validator");

const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isString()
        .withMessage("Email must be a string")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
        .withMessage("Password must contain at least one letter and one number")
];

const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isString()
        .withMessage("Email must be a string")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password must be a string")
];

const forgotPasswordValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isString()
        .withMessage("Email must be a string")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail()
];

const resetPasswordValidation = [
    body("token")
        .trim()
        .notEmpty()
        .withMessage("Token is required")
        .isString()
        .withMessage("Token must be a string"),

    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
        .withMessage("Password must contain at least one letter and one number")
];

module.exports = {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation
};