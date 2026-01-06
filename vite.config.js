import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for deployment (uncomment if using GitHub Pages)
  // base: '/real-state/',
});
