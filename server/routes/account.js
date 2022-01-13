"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const account_1 = require("../controllers/account");
const router = (0, express_1.Router)();
router.post('/account/balances', account_1.balances);
exports.default = router;
