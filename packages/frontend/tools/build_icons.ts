#!/usr/bin/env ts-node

import * as path from "path"
import * as fs from "fs"
import { JSDOM } from "jsdom"
import * as capitalize from "capitalize"
import * as camelcase from "camelcase"
import * as glob from "glob"
import svgr from "@svgr/core"

const iconPath = path.join(
  __dirname,
  "..",
  "src",
  "static",
  "icons",
  "svg",
  "*.svg"
)
const iconsDataDir = path.join(__dirname, "..", "src", "data", "icons.json")
const componentPath = path.join(__dirname, "..", "src", "components", "icons")

interface IconType {
  inputFileName: string
  outputComponentFileName: string
  functionName: string
  baseName: string
}

function getIconFiles(files: string[]): IconType[] {
  return files.map(
    (inputFileName): IconType => {
      const baseName = path
        .basename(inputFileName)
        .replace(/( \(custom\))?\.svg$/, "")
      const functionName = capitalize(camelcase(baseName))
      const outputComponentFileName = `${functionName}.tsx`

      return {
        inputFileName,
        outputComponentFileName,
        functionName,
        baseName,
      }
    }
  )
}

function getViewBox(attr: NamedNodeMap) {
  for (let i = attr.length - 1; i >= 0; i -= 1) {
    if (attr[i].name === "viewBox") {
      return attr[i].value
    }
  }
  return "0 0 24 24"
}

interface iconTemplateProps {
  imports: string
  interfaces: string
  componentName: string
  props: any
  jsx: any
  exports: any
}
function iconTemplate(
  { template }: any,
  opts: any,
  { imports, interfaces, props, componentName, jsx }: iconTemplateProps
) {
  // const { svgAttributes } = opts;
  // const { viewBox } = svgAttributes;

  const plugin = require("../../babel-plugin-replace-svg/lib/index.js")
  const options = {
    componentName: "Icon",
    attributes: [
      {
        key: "viewbox",
        value: "svg:viewbox",
      },
      {
        value: "props",
        literal: "spread",
      },
    ],
  }
  const plugins = [
    "jsx",
    [plugin, options],
    "typescript",
    // '@svgr/plugin-prettier',
  ]

  const typeScriptTpl = template.smart({ plugins })
  const res = typeScriptTpl.ast`${imports}
  import {Icon} from '../basics/Icon';
\n
interface Props {
    color?: "primary" | "secondary" | "tertiary" | "info"  | "success" | "warning" |  "critical";
    size?: "small" | "medium" | "large";
    customColor?: string;
    className?: string;
    ariaHidden?: boolean;
    ariaLabel?: string;
    reverseOnRtl?: boolean;
    dataTest?: string;
};

export function ${componentName}(props: Props) {
    return ${jsx}
}

export default ${componentName};
  `

  return res
}
// const template = (code: string, config: any, state: any) => {
//   console.log('template ->', code);
//   return `
// ;
// };

function cleanComponentDirectory(
  p: string
): Promise<NodeJS.ErrnoException | null> {
  return new Promise((resolve, reject) => {
    fs.rmdir(p, { recursive: true }, (err: NodeJS.ErrnoException) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

function createComponentDirectory(
  p: string | string[]
): Promise<NodeJS.ErrnoException | string | null> {
  let rootPromise = Promise.resolve()
  return new Promise((resolve, reject) => {
    if (Array.isArray(p)) {
      for (const strPath of p) {
        rootPromise.then(() => createComponentDirectory(strPath))
      }
      rootPromise.then(() => resolve()).catch(reject)
    } else {
      fs.mkdir(p, {}, (err: Error, path: string) => {
        err ? reject(err) : resolve(path)
      })
    }
  })
}

function writeSvgFiles(names: IconType[]): Promise<IconType[]> {
  const res = Promise.all(
    names.map(async (p: IconType) => {
      const { inputFileName, outputComponentFileName, functionName } = p
      const dom = await JSDOM.fromFile(inputFileName)
      const content = dom.window.document.querySelector("svg")
      if (!content) {
        throw new Error(`No content for ${inputFileName}`)
      }
      let jsCode = await svgr(
        content.outerHTML,
        {
          template: iconTemplate,
          svgAttributes: {
            viewBox: getViewBox(content.attributes),
          },
        },
        {
          componentName: functionName,
          typescript: true,
        }
      )
      fs.writeFileSync(
        path.join(componentPath, outputComponentFileName),
        jsCode
      )
      return p
    })
  )
  return res
}

function writeIconIndex(names: IconType[]): Promise<IconType[]> {
  return new Promise(resolve => {
    const index = names
      .map(
        ({ functionName }) =>
          `export { default as ${functionName} } from "./${functionName}";\n`
      )
      .join("")
    fs.writeFileSync(path.join(componentPath, "index.tsx"), index)
    resolve(names)
  })
}

async function writeIconsJson(names: IconType[]) {
  const obj = await Promise.all(
    names.map(
      ({ inputFileName, baseName }) =>
        new Promise((resolve, reject) => {
          fs.readFile(inputFileName, "utf8", (err, content) => {
            if (err) reject()
            if (!content) reject()

            // Get the HTML comments
            const rawComments = content.match(/<!--([\s\S]*?)-->/gm)
            const comments = (rawComments || []).map(item => {
              // remove the HTML comments and split by colon
              const items = item.replace(/<!--([\s\S]*?)-->/gm, "$1").split(":")
              // one icon has color as character
              const value = items[1] === "" && items[2] === "" ? ":" : items[1]
              return {
                [items[0]]: value,
              }
            })
            const commentsObject = Object.assign({}, ...comments)
            const dom = JSDOM.fragment(content)
            const ele = dom.querySelector("svg")
            if (!ele) reject()
            const svg = ele!.outerHTML
            resolve({
              [baseName]: {
                ...commentsObject,
                svg,
              },
            })
          })
        })
    )
  )

  fs.writeFileSync(iconsDataDir, JSON.stringify(Object.assign({}, ...obj)))
}
;(async () => {
  try {
    const files = glob.sync(iconPath)
    await cleanComponentDirectory(componentPath)
      .then(() =>
        createComponentDirectory([componentPath, path.dirname(iconsDataDir)])
      )
      .then(() => getIconFiles(files))
      .then((names: IconType[]) => writeSvgFiles(names))
      .then((names: IconType[]) => writeIconIndex(names))
      .then((names: IconType[]) => writeIconsJson(names))
      .catch(err => {
        console.log("An error occurred ->", err)
        throw err
      })
  } catch (err) {
    console.log("An error occurred ->", err)
    throw err
  }
})()
