"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@babel/preset-env");
require("@babel/preset-react");
require("@babel/plugin-proposal-class-properties");
require("@babel/plugin-proposal-export-default-from");
require("@babel/plugin-proposal-export-namespace-from");
require("@babel/plugin-proposal-object-rest-spread");
require("@babel/plugin-proposal-optional-chaining");
require("@babel/plugin-proposal-nullish-coalescing-operator");
const bit_envs_internal_babel_base_compiler_1 = __importDefault(require("@bit/bit.envs.internal.babel-base-compiler"));
const compiledFileTypes = ['js', 'jsx'];
const compile = (files, distPath) => {
    return bit_envs_internal_babel_base_compiler_1.default(files, distPath, __dirname, compiledFileTypes);
};
exports.default = {
    compile,
};
