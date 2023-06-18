import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
  if (command === "build") {
    return {
      base: "/todo-checklist-alpine/",
    };
  }

  return {
    base: "/",
  };
});
