const { matchImports } = require('./matchImports');

const importsVisitor = {
    ImportDeclaration(path, { lastImport, targetedImports }) {
        if (path.node === lastImport) {
            path.insertAfter(targetedImports);
            return;
        }

        // TODO targetedImports.has(node);
        if (targetedImports.find(node => node === path.node)) {
            path.remove();
        }
    },
};

module.exports = () => {
    const visitor = {
        Program(path, state) {
            const { targetedImports, lastImportIndex } = matchImports({
                nodes: path.node.body,
                pattern: state.opts.pattern,
            });

            // no matched imported
            if (!targetedImports.length) {
                return;
            }

            const lastImport = path.node.body[lastImportIndex];
            path.traverse(importsVisitor, { targetedImports, lastImport });
        },
    };

    return {
        visitor,
    };
};
