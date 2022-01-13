"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const friend_1 = require("../controllers/friend");
const router = (0, express_1.Router)();
router.post('/friend/add', friend_1.add);
router.delete('/friend/remove', friend_1.remove);
exports.default = router;
