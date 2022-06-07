import { Scope } from "../scope";
import { parseString } from "../stringparser";
import { funcData, FunctionData } from "../typings/interface";
import { convertToBool, escapeResult, parseData } from "../util";

export const $authorAvatar: FunctionData = {
  name: "$authorAvatar",
  brackets: true,
  optional: true,
  type: "getter",
  fields: [
    {
      name: "size",
      type: "number",
      required: false,
    },
    {
      name: "dynamic",
      type: "boolean",
      required: false,
    },
    {
      name: "format",
      type: "string",
      required: false,
    },
  ],
  default: ["4096","yes","webp"],
  returns: "string",
  description: "Returns the avatar of the author",
  code: (data: funcData, scope: Scope[]) => {
    const [size = `4096`, dynamic = "yes", format = "webp"] = data.splits;
    const typedSize = parseData(size);
    const parsedSize =
      typeof typedSize === "number" ? typedSize : parseString(size);
    const parsedDynamic = convertToBool(dynamic);
    const parsedFormat = parseString(format);
    let res = escapeResult(`__$DISCORD_DATA$__.author?.avatarURL({
      size: ${parsedSize},
      forceStatic: ${!parsedDynamic},
      extension: ${parsedFormat},
    })`);
    const currentScope = scope[scope.length - 1];
    currentScope.rest = currentScope.rest.replace(data.total, res);
    return {
      code: res,
      scope: scope,
    };
  },
};
