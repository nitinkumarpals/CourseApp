import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"], // Include all .ts files in src
  splitting: false, // Keep files separate (not bundled into one)
  sourcemap: true, // Generate sourcemaps for debugging
  clean: true, // Clean the output directory before each build
  format: ["esm"], // Output as ES Modules
  outDir: "dist", // Output directory
//   dts: true, // Generate declaration (.d.ts) files for TypeScript
  target: "es2020", // Target modern JavaScript
  esbuildOptions(options) {
    options.platform = "node"; // Ensure compatibility with Node.js
  },
});
