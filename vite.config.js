import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from "dotenv"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define:{
    'process.env.VITE_BASE_URL':JSON.stringify(process.env.VITE_BASE_URL),
    'process.env.VITE_FRONTEND_BASE_URL':JSON.stringify(process.env.VITE_FRONTEND_BASE_URL) 
  }
})
