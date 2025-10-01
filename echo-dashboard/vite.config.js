import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// The repository name, including leading and trailing slashes
const REPO_NAME = '/nhsl-echo-cardio/' 
// https://vite.dev/config/
export default defineConfig({
  base: REPO_NAME, 
  plugins: [react()],
})
