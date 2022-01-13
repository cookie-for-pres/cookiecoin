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
exports.unblock = exports.block = exports.remove = exports.add = void 0;
const uuid_1 = require("uuid");
const Account_1 = __importDefault(require("../models/Account"));
const Friend_1 = __importDefault(require("../models/Friend"));
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId, friendId } = req.body;
    const account = yield Account_1.default.findOne({ _id: accountId });
    const friendAccount = yield Account_1.default.findOne({ _id: friendId });
    const friendCheck1 = yield Friend_1.default.findOne({ friend: friendId, owner: accountId });
    const friendCheck2 = yield Friend_1.default.findOne({ friend: accountId, owner: friendId });
    if (account) {
        if (friendAccount) {
            if (account._id !== friendAccount._id) {
                if (!friendCheck1 && !friendCheck2) {
                    const friend = new Friend_1.default({
                        _id: (0, uuid_1.v4)(),
                        owner: account._id,
                        friend: friendAccount._id
                    });
                    yield friend.save((err) => {
                        if (!err) {
                            res.json({
                                message: 'successfully sent friend request',
                                success: true
                            });
                        }
                        else {
                            res.status(500).json({
                                message: 'unknown error',
                                success: false,
                                error: err.message
                            });
                        }
                    });
                }
                else {
                    res.status(409).json({
                        message: 'already friends',
                        success: false
                    });
                }
            }
            else {
                res.status(409).json({
                    message: 'cant add yourself',
                    success: false
                });
            }
        }
        else {
            res.status(404).json({
                message: 'cant find friend',
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
exports.add = add;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId, friendId } = req.body;
    const account = yield Account_1.default.findOne({ _id: accountId });
    const friend = yield Friend_1.default.findOne({ _id: friendId });
    if (account) {
        if (friend) {
            let newFriends1 = [];
            let newFriends2 = [];
            account.friends.forEach((friend1) => {
                if (friend1 !== friend._id) {
                    newFriends1.push(friend1);
                }
            });
            friend.friends.forEach((friend1) => {
                if (friend1 !== account._id) {
                    newFriends2.push(friend1);
                }
            });
            account.friends = newFriends1;
            friend.friends = newFriends2;
            yield account.save((err) => __awaiter(void 0, void 0, void 0, function* () {
                if (!err) {
                    yield friend.save((err1) => {
                        if (!err1) {
                            res.json({
                                message: 'successfully removed friend',
                                success: true
                            });
                        }
                        else {
                            res.status(500).json({
                                message: 'unknown error',
                                success: false,
                                error: err1.message
                            });
                        }
                    });
                }
                else {
                    res.status(500).json({
                        message: 'unknown error',
                        success: false,
                        error: err.message
                    });
                }
            }));
            res.status(409).json({
                message: 'not friends',
                success: false
            });
        }
        else {
            res.status(404).json({
                message: 'cant find friend',
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
exports.remove = remove;
const block = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.block = block;
const unblock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.unblock = unblock;
