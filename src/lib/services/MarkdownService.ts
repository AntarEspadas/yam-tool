import type { RendererObject, TokensList, Tokens } from "marked"
import { marked } from "marked"

const renderer = {
  heading(text: string, depth: number) {
    return `<h${depth} class="h${depth}">${text}</h${depth}>`
  },
  codespan(text: string) {
    return `<code class="code">${text}</code>`
  },
  link(href: string, _: unknown, text: string) {
    const a = document.createElement("a")
    a.href = href
    a.innerText = text
    a.className = "anchor"
    return a.outerHTML
  },
  blockquote(text: string) {
    return `<blockquote class="blockquote">${text}</blockquote>`
  },
}

marked.use({ renderer: renderer as unknown as RendererObject })

export class MarkdownService {
  public partialParse(markdown: string) {
    const result: (string | Tokens.Code | Tokens.Generic)[] = []
    const tokens = marked.lexer(markdown)
    const tokenSections = this.separateCodeBlocks(tokens)
    for (const section of tokenSections) {
      if (section.length === 0) continue
      if (section[0].type !== "code") {
        result.push(marked.parser(section))
      } else {
        result.push(section[0])
      }
    }
    return result
  }

  private separateCodeBlocks(tokens: TokensList) {
    if (tokens.length === 0) return []

    const firstList = [] as unknown as TokensList
    firstList.links = tokens.links
    const result: TokensList[] = [firstList]

    for (const token of tokens) {
      if (token.type !== "code") {
        result.at(-1)?.push(token)
      } else {
        const codeList = [token] as unknown as TokensList
        codeList.links = tokens.links
        const newList = [] as unknown as TokensList
        newList.links = tokens.links
        result.push(codeList, newList)
      }
    }

    return result
  }
}

export const markdownService = new MarkdownService()
