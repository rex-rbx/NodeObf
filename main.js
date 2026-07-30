import { createRequire } from "node:module";
import JsConfuserVM from "js-confuser-vm"
const require = createRequire(import.meta.url);
const jsConf = require("js-confuser");
const AntiTamper = `const DbgException = function() {
    const globalThis_ = globalThis
    const global_ = global
    for (const key in globalThis_) {
        globalThis_[key] = undefined;
    }
    for (const key in global_) {
        global_[key] = undefined;
    }
    while (true) {
        for (let i = 0; i < 1000000; i++) {
        }
    }
}
if (DbgException.toString().match('\\\\[native code\\\\]')) DbgException()
if (Object.prototype.toString.toString() !== 'function toString() { [native code] }') DbgException()
if (Function.prototype.toString() !== 'function () { [native code] }') DbgException()
if (JSON.parse.toString() !== 'function parse() { [native code] }') DbgException()
if (JSON.stringify.toString() !== 'function stringify() { [native code] }') DbgException()
if (!performance.now.toString().match('now\\\\(\\\\) {') || !performance.now.toString().match('return now\\\\(\\\\)') || !performance.now.toString().match('validateThisInternalField')) DbgException()
if (process.execArgv.some(arg => arg.includes('--inspect') || arg.includes('--debug'))) DbgException()
if (process.env.NODE_OPTIONS && process.env.NODE_OPTIONS.includes('--inspect')) DbgException()
if (require.cache && Object.getOwnPropertyDescriptor(require, 'cache')?.writable !== true) DbgException()
if (!require.toString().match("return mod\\\\.require\\\\(path\\\\)"))  DbgException()
if (Promise.toString() !== 'function Promise() { [native code] }') DbgException()
if (Object.prototype.hasOwnProperty('__proto__') && Object.getPrototypeOf({}) !== Object.prototype) DbgException()
if (Function.prototype.hasOwnProperty('bind') && Function.prototype.bind.toString() !== 'function bind() { [native code] }') DbgException()
if (Array.prototype.map.toString() !== 'function map() { [native code] }') DbgException()
const originalPrepare = Error.prepareStackTrace
Error.prepareStackTrace = (err, stack) => stack
const stackTest = new Error().stack
Error.prepareStackTrace = originalPrepare
if (Array.isArray(stackTest) === false) DbgException()
if (setTimeout.toString() !== 'function setTimeout() { [native code] }') {
    DbgException()
}
if (typeof global.gc === 'function') DbgException()`
export default (async (sourceCode) => {
    let {code: virtualized} = await jsConfVM.obfuscate(AntiTamper + '\n' + sourceCode, {
          target: "node",
          randomizeOpcodes: true,
          shuffleOpcodes: true,
          encodeBytecode: true,
          selfModifying: true,
          dispatcher: true,
          controlFlowFlattening: true,
          stringConcealing: true,
          macroOpcodes: true,
          specializedOpcodes: true,
          aliasedOpcodes: true,
          antiInstrumentation: true,
          timingChecks: true,
          concealConstants: true,
          classObfuscation: true,
          handlerTable: true,
          minify: false,
        })
      virtualized = virtualized.replace(/var globals = globalThis;/g, `var globals = globalThis; 
      globals.globalThis = globalThis;
      if (typeof global !== 'undefined') globals.global = global; 
      if (typeof process !== 'undefined') globals.process = process; 
      if (typeof require !== 'undefined') globals.require = require; 
      if (typeof navigator !== 'undefined') globals.navigator = navigator; 
      if (typeof document !== 'undefined') globals.document = document;`)
    const { code: obfuscated } = await jsConf.obfuscate(virtualized, {
      target: 'node',
      calculator: 0.2,
      compact: true,
      hexadecimalNumbers: true,
      controlFlowFlattening: 0.15,
      duplicateLiteralsRemoval: 1,
      identifierGenerator: 'hexadecimal',
      minify: true,
      astScrambler: true,
      lock: {
        antiDebug: false,
        integrity: false,
        tamperProtection: false,
      },
      deadCode: true,
      renameGlobals: false,
      renameLabels: false,
      renameVariables: true,
    })
    return obfuscated;
  })
