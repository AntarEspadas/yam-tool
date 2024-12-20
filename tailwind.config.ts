import { join } from "path"
import type { Config } from "tailwindcss"
import forms from "@tailwindcss/forms"

// 1. Import the Skeleton plugin
import { skeleton } from "@skeletonlabs/tw-plugin"

const config = {
  // 2. Opt for dark mode to be handled via the class method
  darkMode: "class",
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    // 3. Append the path to the Skeleton package
    join(require.resolve("@skeletonlabs/skeleton"), "../**/*.{html,js,svelte,ts}"),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    forms,
    // 4. Append the Skeleton plugin (after other plugins)
    skeleton({ themes: { preset: ["skeleton"] } }),
  ],
  // We want to prevent Tailwind from deleting these styles even if they're not directly used in the markup,
  // as they may end up being produced by rendered markdown content
  safelist: ["h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code"],
} satisfies Config

export default config
