const types = require('@babel/types');

function matchImports({ nodes, pattern }) {
    const foundImports = [];
    let lastImportIndex = 0;

    for (let index = 0; index < nodes.length; index++) {
        const node = nodes[index];

        if (!types.isImportDeclaration(node)) {
            break;
        }

        const importStatement = node.source.value;
        lastImportIndex = index;

        if (pattern.test(importStatement)) {
            foundImports.push({ node, index });
        }
    }

    const targetedImports = foundImports.map(item => item.node);

    for (let index = foundImports.length - 1; index >= 0; index--) {
        const item = foundImports[index];

        if (lastImportIndex === item.index) {
            lastImportIndex--;
            targetedImports.pop();
        } else {
            break;
        }
    }

    return { targetedImports, lastImportIndex };
}

module.exports = {
    matchImports,
};
