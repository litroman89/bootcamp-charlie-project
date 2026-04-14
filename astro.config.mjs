import netlify from '@astrojs/netlify';
import node from '@astrojs/node';
import { defineConfig } from 'astro/config';

export default defineConfig({
  // есть форма, значит проект работает как сервер
  output: 'server', 

  // Проверяем: если есть переменная NETLIFY, ставим их адаптер. 
  // Если нет (как в Docker) — ставим Node.
  adapter: process.env.NETLIFY 
    ? netlify() 
    : node({
        mode: 'standalone'
      }),

  image: {
    service: {
      entrypoint: 'astro/assets/services/noop'
    }
  }
});