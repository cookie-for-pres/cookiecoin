"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.join = exports.find = exports.games = void 0;
const Account_1 = __importDefault(require("../models/Account"));
const Game_1 = __importDefault(require("../models/Game"));
const games = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId } = req.body;
    const account = yield Account_1.default.findOne({ _id: accountId });
    const displayGames = yield Game_1.default.find({ display: true });
    const joinableGames = yield Game_1.default.find({ display: false });
    if (account) {
        res.json({
            message: 'successfully found games',
            success: true,
            displayGames,
            joinableGames
        });
    }
    else {
        res.status(404).json({
            message: 'cant find account',
            success: false
        });
    }
});
exports.games = games;
const find = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId, code } = req.body;
    const account = yield Account_1.default.findOne({ _id: accountId });
    const game = yield Game_1.default.findOne({ 'data.code': code });
    if (account) {
        if (game) {
            if (game.data.players.active < game.data.players.max) {
                if (game.data.passwordRequired) {
                    const password = req.body.password;
                    if (game.data.password === password) {
                        res.json({
                            message: 'game found',
                            success: true,
                            game: {
                                _id: game._id,
                                code: game.data.code,
                                password: game.data.password
                            }
                        });
                    }
                    else {
                        res.status(401).json({
                            message: 'game found but invalid password',
                            success: false
                        });
                    }
                }
                else {
                    res.json({
                        message: 'game found',
                        success: true,
                        game: {
                            _id: game._id,
                            code: game.data.code,
                            password: 'NO_PASS'
                        }
                    });
                }
            }
            else {
                res.status(409).json({
                    message: 'game is full',
                    success: false
                });
            }
        }
        else {
            res.status(404).json({
                message: 'cant find game',
                success: false
            });
        }
    }
    else {
        res.status(404).json({
            message: 'cant find account',
            success: false
        });
    }
});
exports.find = find;
const join = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId, code } = req.body;
    const account = yield Account_1.default.findOne({ _id: accountId });
    const game = yield Game_1.default.findOne({ 'data.code': code });
    if (account) {
        if (game) {
            if (game.data.players.active < game.data.players.max) {
                game.data.players.players.push(account._id);
                game.data.players.active++;
            }
            else {
                res.status(409).json({
                    message: 'game is full',
                    success: false
                });
            }
        }
        else {
            res.status(404).json({
                message: 'cant find game',
                success: false
            });
        }
    }
    else {
        res.status(404).json({
            message: 'cant find account',
            success: false
        });
    }
});
exports.join = join;
