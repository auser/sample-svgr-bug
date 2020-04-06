module.exports = function replaceSvgWith(
  { types: t, template },
  { componentName = 'div', attributes = [] },
  state
) {
  function replaceElement(path, state) {
    const { name } = path.node.openingElement.name;

    const getLiteralValue = (value) => {
      if (typeof value === 'boolean') {
        return t.jsxExpressionContainer(t.booleanLiteral(value));
      }

      if (typeof value === 'number') {
        return t.jsxExpressionContainer(t.numericLiteral(value));
      }

      if (typeof value === 'string') {
        return t.stringLiteral(value);
      }
      return null;
    };

    const fetchAttribute = (name) => {
      let attrs = path.node.openingElement.attributes || [];
      for (let i = 0; i < attrs.length; i += 1) {
        const attr = attrs[i];
        if (attr.name.name === name) {
          return attr.value.value;
        }
      }
      return null;
    };

    const getAttributeValue = ({ key, value, literal = null }) => {
      if (literal === 'props') {
        return t.JSXExpressionContainer(
          template.ast(`props.${key}`).expression
        );
      } else if (literal === 'expression') {
        return t.jsxExpressionContainer(template.ast(`${value}`).expression);
      } else if (literal === 'spread') {
        return convertToSpreadAttributes(value);
      } else if (literal === 'svg') {
        return getLiteralValue(fetchAttribute(key));
      } else {
        return getLiteralValue(value);
      }
    };

    function convertToPropsExpression(key) {
      const val = getAttributeValue({
        key,
        literal: 'props',
      });
      return val ? t.jsxAttribute(t.jsxIdentifier(key), val) : null;
    }

    function convertObjectToExpression(obj) {
      if (obj.literal && obj.literal === 'spread') {
        return convertToSpreadAttributes(obj.value);
      } else {
        const val = getAttributeValue(obj);
        return val ? t.jsxAttribute(t.jsxIdentifier(obj.key), val) : null;
      }
    }

    function convertToSpreadAttributes(value) {
      return t.jsxSpreadAttribute(t.identifier(value));
    }

    // t.JSXExpressionContainer(template.ast(`${value}`).expression));

    const convertToExpressions = (value) =>
      typeof value === 'object'
        ? convertObjectToExpression(value)
        : convertToPropsExpression(value);

    // Replace element by react-native-svg components
    // const component = elementToComponent[name]

    // const openingElementName = path.get('openingElement.name');
    const attrs = (attributes && attributes.length
      ? attributes.map(convertToExpressions)
      : [convertToSpreadAttributes('props')]
    ).filter((t) => !!t);

    path.replaceWith(
      t.JSXElement(
        t.JSXOpeningElement(t.JSXIdentifier(componentName), attrs),
        t.JSXClosingElement(t.JSXIdentifier(componentName)),
        path.node.children
      )
    );
    return;
  }

  var svgElementVisitor = {
    JSXElement(path, state) {
      if (
        !path.get('openingElement.name').isJSXIdentifier({
          name: 'svg',
        })
      ) {
        return;
      }

      replaceElement(path, state);
    },
  };

  return {
    visitor: {
      Program(path, state) {
        state.replacedComponent = false;
        path.traverse(svgElementVisitor, state);
      },
    },
  };
};
