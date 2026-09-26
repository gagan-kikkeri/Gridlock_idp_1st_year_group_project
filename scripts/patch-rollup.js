import fs from 'fs';
import path from 'path';

const nativeJsPath = path.resolve('node_modules/rollup/dist/native.js');

if (fs.existsSync(nativeJsPath)) {
  let content = fs.readFileSync(nativeJsPath, 'utf8');
  if (!content.includes('@rollup/wasm-node/dist/native.js')) {
    content = content.replace(
      'const requireWithFriendlyError = id => {\n\ttry {\n\t\treturn require(id);\n\t} catch (error) {',
      'const requireWithFriendlyError = id => {\n\ttry {\n\t\treturn require(id);\n\t} catch (error) {\n\t\ttry {\n\t\t\treturn require("@rollup/wasm-node/dist/native.js");\n\t\t} catch (e) {}'
    );
    fs.writeFileSync(nativeJsPath, content, 'utf8');
    console.log('[Gridlock] Successfully ensured Rollup WASM compatibility patch.');
  }
}
