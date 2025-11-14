#!/usr/bin/env node
const path = require("node:path");

if (!process.env.TS_NODE_PROJECT) {
        process.env.TS_NODE_PROJECT = path.resolve(__dirname, "../tsconfig.json");
}

const tsNode = require("ts-node");
tsNode.register({
        transpileOnly: true,
        compilerOptions: {
                module: "commonjs",
                jsx: "react-jsx",
        },
});

require("tsconfig-paths/register");

require.extensions[".svg"] = (module) => {
        module.exports = "";
};

const [, , scriptPath, ...scriptArgs] = process.argv;

if (!scriptPath) {
        console.error("Usage: node tools/run-ts.js <path-to-script> [args...]");
        process.exit(1);
}

const resolvedScript = path.resolve(process.cwd(), scriptPath);

Promise.resolve()
        .then(() => require(resolvedScript))
        .then(async (moduleExports) => {
                const runner = moduleExports.default || moduleExports.run || moduleExports;

                if (typeof runner === "function") {
                        const result = await runner({ args: scriptArgs });

                        if (result && typeof result === "object" && "code" in result) {
                                process.exit(result.code);
                        }

                        return;
                }

                console.warn("The target script did not export a runnable function. Module exports: %o", moduleExports);
        })
        .catch((error) => {
                console.error("Failed to execute %s", scriptPath);
                console.error(error);
                process.exit(1);
        });
