import typescript from "@rollup/plugin-typescript";
export default {
  input: "./src/index.ts",
  output: [
    {
      format: "cjs",
      file: "./lib/m-vue.cjs.js",
    },
    {
      format: "es",
      file: "./lib/m-vue.esm.js",
    },
  ],
  plugins: [typescript()],
};
