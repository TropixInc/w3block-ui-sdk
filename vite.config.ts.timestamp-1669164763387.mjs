// vite.config.ts
import react from "file:///D:/Users/danil/Documents/Github/Tropix/w3block-ui-sdk/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import url from "url";
import { defineConfig } from "file:///D:/Users/danil/Documents/Github/Tropix/w3block-ui-sdk/node_modules/vite/dist/node/index.js";
import dts from "file:///D:/Users/danil/Documents/Github/Tropix/w3block-ui-sdk/node_modules/vite-plugin-dts/dist/index.mjs";
import svgr from "file:///D:/Users/danil/Documents/Github/Tropix/w3block-ui-sdk/node_modules/vite-plugin-svgr/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\Users\\danil\\Documents\\Github\\Tropix\\w3block-ui-sdk";
var __vite_injected_original_import_meta_url = "file:///D:/Users/danil/Documents/Github/Tropix/w3block-ui-sdk/vite.config.ts";
var _dirname = typeof __vite_injected_original_dirname === "undefined" ? path.dirname(url.fileURLToPath(__vite_injected_original_import_meta_url)) : __vite_injected_original_dirname;
var vite_config_default = defineConfig({
  build: {
    lib: {
      entry: path.resolve(_dirname, "src/index.tsx"),
      name: "w3block-ui-sdk",
      formats: ["es", "umd"],
      fileName: "w3block-ui-sdk"
    },
    rollupOptions: {
      external: ["react", "react-dom", "next-auth", "react-query"],
      output: {
        sourcemap: true,
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-query": "react-query"
        }
      }
    }
  },
  plugins: [
    react(),
    svgr(),
    dts({
      insertTypesEntry: true
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxkYW5pbFxcXFxEb2N1bWVudHNcXFxcR2l0aHViXFxcXFRyb3BpeFxcXFx3M2Jsb2NrLXVpLXNka1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcVXNlcnNcXFxcZGFuaWxcXFxcRG9jdW1lbnRzXFxcXEdpdGh1YlxcXFxUcm9waXhcXFxcdzNibG9jay11aS1zZGtcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1VzZXJzL2RhbmlsL0RvY3VtZW50cy9HaXRodWIvVHJvcGl4L3czYmxvY2stdWktc2RrL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCB1cmwgZnJvbSAndXJsJztcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJztcclxuaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3Zncic7XHJcblxyXG5jb25zdCBfZGlybmFtZSA9XHJcbiAgdHlwZW9mIF9fZGlybmFtZSA9PT0gJ3VuZGVmaW5lZCdcclxuICAgID8gcGF0aC5kaXJuYW1lKHVybC5maWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpXHJcbiAgICA6IF9fZGlybmFtZTtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgYnVpbGQ6IHtcclxuICAgIGxpYjoge1xyXG4gICAgICBlbnRyeTogcGF0aC5yZXNvbHZlKF9kaXJuYW1lLCAnc3JjL2luZGV4LnRzeCcpLFxyXG4gICAgICBuYW1lOiAndzNibG9jay11aS1zZGsnLFxyXG4gICAgICBmb3JtYXRzOiBbJ2VzJywgJ3VtZCddLFxyXG4gICAgICBmaWxlTmFtZTogJ3czYmxvY2stdWktc2RrJyxcclxuICAgIH0sXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIGV4dGVybmFsOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICduZXh0LWF1dGgnLCAncmVhY3QtcXVlcnknXSxcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgc291cmNlbWFwOiB0cnVlLFxyXG4gICAgICAgIGdsb2JhbHM6IHtcclxuICAgICAgICAgIHJlYWN0OiAnUmVhY3QnLFxyXG4gICAgICAgICAgJ3JlYWN0LWRvbSc6ICdSZWFjdERPTScsXHJcbiAgICAgICAgICAncmVhY3QtcXVlcnknOiAncmVhY3QtcXVlcnknLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIHN2Z3IoKSxcclxuICAgIGR0cyh7XHJcbiAgICAgIGluc2VydFR5cGVzRW50cnk6IHRydWUsXHJcbiAgICB9KSxcclxuICBdLFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErVixPQUFPLFdBQVc7QUFDalgsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sU0FBUztBQUNoQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBTGpCLElBQU0sbUNBQW1DO0FBQXNMLElBQU0sMkNBQTJDO0FBT2hSLElBQU0sV0FDSixPQUFPLHFDQUFjLGNBQ2pCLEtBQUssUUFBUSxJQUFJLGNBQWMsd0NBQWUsQ0FBQyxJQUMvQztBQUdOLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU87QUFBQSxJQUNMLEtBQUs7QUFBQSxNQUNILE9BQU8sS0FBSyxRQUFRLFVBQVUsZUFBZTtBQUFBLE1BQzdDLE1BQU07QUFBQSxNQUNOLFNBQVMsQ0FBQyxNQUFNLEtBQUs7QUFBQSxNQUNyQixVQUFVO0FBQUEsSUFDWjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLFNBQVMsYUFBYSxhQUFhLGFBQWE7QUFBQSxNQUMzRCxRQUFRO0FBQUEsUUFDTixXQUFXO0FBQUEsUUFDWCxTQUFTO0FBQUEsVUFDUCxPQUFPO0FBQUEsVUFDUCxhQUFhO0FBQUEsVUFDYixlQUFlO0FBQUEsUUFDakI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLEtBQUs7QUFBQSxJQUNMLElBQUk7QUFBQSxNQUNGLGtCQUFrQjtBQUFBLElBQ3BCLENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
