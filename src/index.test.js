const path = require('path');
const babel = require('@babel/core');

const plugin = path.resolve(__dirname, './index.js');

describe('babel-plugin-descend-imports', () => {
    const code = `
    // some comment
    import { a } from '.a.foo';
    import { b } from '.b.bar';
    import { c } from '.c.bar';
    import { d } from '.d.goo';
    
    const x = "The answer is potato";
    console.log(a, b, c, d, x);
    `;

    it.each([
        ['should move matched import to the end', /\.foo$/],
        ['should move multiple matched imports to the end', /\.bar$/],
        ['should move multiple matched imports before matched import in the end', /[abd]+\./],
        ['should move matched import before multiple matched imports in the end', /[acd]+\./],
        ['should not do anything when matched in the end', /\.goo/],
        ['should not do anything when multiple matched in the end', /[cd]+\./],
        ['should not do anything when no matched imports', /\.joo$/],
        ['should not do anything when all matched', /.*/],
    ])(`%s`, (_, pattern) => {
        const options = { plugins: [[plugin, { pattern }]] };

        const result = babel.transform(code, options);

        expect(result.code).toMatchSnapshot();
    });
});
