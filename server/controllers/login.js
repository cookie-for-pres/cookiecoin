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
const Account_1 = __importDefault(require("../models/Account"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const account = yield Account_1.default.findOne({ username });
    if (username && password) {
        if (account) {
            if (!account.banned) {
                account.comparePassword(password, (err, match) => __awaiter(void 0, void 0, void 0, function* () {
                    if (!err) {
                        if (match) {
                            res.json({
                                message: 'successfully logged in',
                                success: true,
                                id: account._id
                            });
                        }
                        else {
                            res.status(401).json({
                                message: 'invalid password',
                                success: false
                            });
                        }
                    }
                    else {
                        res.status(500).json({
                            message: 'unknown error',
                            success: false,
                            error: err.message
                        });
                    }
                }));
            }
            else {
                res.status(401).json({
                    message: 'account is banned',
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
    }
    else {
        res.status(409).json({
            message: 'username and password are required fields',
            success: false
        });
    }
});
