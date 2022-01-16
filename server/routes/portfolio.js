"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const portfolio_1 = require("../controllers/portfolio");
const router = (0, express_1.Router)();
router.post('/portfolio', portfolio_1.portfolio);
router.post('/portfolio/transfer', portfolio_1.transfer);
exports.default = router;
