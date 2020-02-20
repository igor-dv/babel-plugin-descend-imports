const types = require('@babel/types');

const importsVisitor = {
    ImportDeclaration(path, state) {
        if (path.node === state.targetedImport) {
            path.remove();
            return;
        }

        if (path.node === state.lastImport) {
            path.insertAfter(state.targetedImport);
        }
    },
};

module.exports = () => {
    const visitor = {
        Program(path, state) {
            const foundImportNodes = [];
            let index = 0;

            for (; index < path.node.body.length; index++) {
                const node = path.node.body[index];

                if (!types.isImportDeclaration(node)) {
                    break;
                }

                const importStatement = node.source.value;

                if (state.opts.pattern.test(importStatement)) {
                    foundImportNodes.push({ node, index });
                }
            }

            // no matched imported
            if (!foundImportNodes.length) {
                return;
            }

            // more than one matched imported
            if (foundImportNodes.length > 1) {
                // TBD support more than one matched import
                return;
            }

            // the matched import is the last in the imports block
            if (foundImportNodes[0].index === index - 1) {
                return;
            }

            // the matched import is not the last in the imports block
            if (foundImportNodes[0].index < index - 1) {
                path.traverse(importsVisitor, {
                    targetedImport: foundImportNodes[0].node,
                    lastImport: path.node.body[index - 1],
                });
            }
        },
    };

    return {
        visitor,
    };
};
