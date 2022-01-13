"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const game_1 = require("../controllers/game");
const router = (0, express_1.Router)();
router.post('/games', game_1.games);
router.post('/games/find', game_1.find);
exports.default = router;
