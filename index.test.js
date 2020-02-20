const babel = require('@babel/core');

const plugin = './index.js';

describe('babel-plugin-descend-imports', () => {
    let code;

    beforeEach(() => {
        code = `
        import { a } from '.a.foo'
        import { b } from '.b.bar'
        
        const x = "the answer is potato"
        `;
    });

    it('should move matched import to the end', () => {
        const options = { plugins: [[plugin, {pattern: /\.foo$/}]] };

        const result = babel.transform(code, options);

        expect(result.code).toMatchSnapshot();
    });

    it('should not do anything when no matched imports', () => {
        const options = { plugins: [[plugin, {pattern: /\.goo$/}]] };

        const result = babel.transform(code, options);

        expect(result.code).toMatchSnapshot();
    })
});
