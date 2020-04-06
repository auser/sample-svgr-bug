import { transform } from '@babel/core';
import plugin from '.';

const jsx = require('@babel/plugin-syntax-jsx');

const testPlugin = (code, options) => {
  const result = transform(code, {
    plugins: [jsx, [plugin, options]],
    configFile: false,
  });

  return result.code;
};

describe('plugin', () => {
  it('should replace svg with <div>', () => {
    expect(
      testPlugin('<svg><g /></svg>', {
        componentName: 'div',
      })
    ).toMatchInlineSnapshot(`"<div {...props}><g /></div>;"`);
  });
  it('should replace svg with <div id="blah" respecting a single attribute>', () => {
    expect(
      testPlugin('<svg><g /></svg>', {
        componentName: 'div',
        attributes: ['id'],
      })
    ).toMatchInlineSnapshot(`"<div id={props.id}><g /></div>;"`);
  });
  it('should replace svg respecting object (key,value)', () => {
    expect(
      testPlugin('<svg><g /></svg>', {
        componentName: 'div',
        attributes: [
          'id',
          {
            key: 'name',
            value: 'bob',
          },
        ],
      })
    ).toMatchInlineSnapshot(
      `"<div id={props.id} name=\\\"bob\\\"><g /></div>;"`
    );
  });

  it('should replace svg respecting array of expression strings', () => {
    expect(
      testPlugin('<svg><g /></svg>', {
        componentName: 'div',
        attributes: [
          'id',
          {
            key: 'name',
            value: "props.name === 'tim'",
            literal: 'expression',
          },
        ],
      })
    ).toMatchInlineSnapshot(
      `"<div id={props.id} name={props.name === 'tim'}><g /></div>;"`
    );
  });
  it('should replace svg respecting array of expression props', () => {
    expect(
      testPlugin('<svg><g /></svg>', {
        componentName: 'div',
        attributes: [
          'id',
          {
            key: 'name',
            literal: 'props',
          },
        ],
      })
    ).toMatchInlineSnapshot(
      `"<div id={props.id} name={props.name}><g /></div>;"`
    );
  });
  it('should add original svg attribute', () => {
    expect(
      testPlugin('<svg viewBox="0 0 24 24"><g /></svg>', {
        componentName: 'div',
        attributes: [
          {
            key: 'viewBox',
            literal: 'svg',
          },
        ],
      })
    ).toMatchInlineSnapshot(`"<div viewBox=\\\"0 0 24 24\\\"><g /></div>;"`);
  });
  it('should add original svg attribute if it does not exist', () => {
    expect(
      testPlugin('<svg viewBox="0 0 24 24"><g /></svg>', {
        componentName: 'div',
        attributes: [
          {
            key: 'name',
            literal: 'svg',
          },
        ],
      })
    ).toMatchInlineSnapshot(`"<div><g /></div>;"`);
  });
  it('should replace svg respecting spread expression', () => {
    expect(
      testPlugin('<svg><g /></svg>', {
        componentName: 'div',
        attributes: [
          'id',
          {
            value: 'props',
            literal: 'spread',
          },
        ],
      })
    ).toMatchInlineSnapshot(`"<div id={props.id} {...props}><g /></div>;"`);
  });
});
