import { Scope } from "../scope";
import { parseString } from "../stringparser";
import { funcData, FunctionData } from "../typings/interface";
import { escapeResult } from "../util";

export const $isServerVerified: FunctionData = {
  name: "$isServerVerified",
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
  version: "1.0.0",
  default: ["__$DISCORD_DATA$__.guild?.id"],
  returns: "boolean",
  description: "Checks if the server is verified",
  code: (data: funcData, scope: Scope[]) => {
    let res;
    const id = data.inside ?? `__$DISCORD_DATA$__.guild?.id`;
    const currentScope = scope[scope.length - 1];
    const parsedId = parseString(id);
    res = escapeResult(
      `__$DISCORD_DATA$__.guilds.cache.get(${parsedId})?.verified ?? false`,
    );

    currentScope.rest = currentScope.rest.replace(data.total, res);
    return {
      code: res,
      scope: scope,
    };
  },
};
