"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaderboard_1 = __importDefault(require("../controllers/leaderboard"));
const router = (0, express_1.Router)();
router.post('/leaderboard', leaderboard_1.default);
exports.default = router;
