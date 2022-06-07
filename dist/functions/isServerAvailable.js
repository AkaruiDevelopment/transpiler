"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$isServerAvailable = void 0;
const stringparser_1 = require("../stringparser");
const util_1 = require("../util");
exports.$isServerAvailable = {
    name: "$isServerAvailable",
    brackets: true,
    optional: true,
    type: "getter",
    fields: [
        {
            name: "guildId",
            type: "Snowflake",
            required: false,
        },
    ],
    default: ["__$DISCORD_DATA$__.guild?.id"],
    returns: "boolean",
    description: "Checks if the server is available",
    code: (data, scope) => {
        let res;
        const id = data.inside ?? `__$DISCORD_DATA$__.guild?.id`;
        const currentScope = scope[scope.length - 1];
        ////console.log({vars:currentScope.variables})
        const parsedId = (0, stringparser_1.parseString)(id);
        res = (0, util_1.escapeResult)(`__$DISCORD_DATA$__.guilds.cache.get(${parsedId})?.available ?? false`);
        currentScope.rest = currentScope.rest.replace(data.total, res);
        return {
            code: res,
            scope: scope,
        };
    },
};
//# sourceMappingURL=isServerAvailable.js.map