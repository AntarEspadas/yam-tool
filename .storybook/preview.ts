import type { Preview } from "@storybook/svelte"
import Decorator from "./Decorator.svelte"

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  // @ts-expect-error Storybook complains about the type of `Decorator` even though the
  // code works and is correct as per the docs https://storybook.js.org/docs/writing-stories/decorators
  decorators: [() => Decorator],
}

export default preview
