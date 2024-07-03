import DOMPurify from "dompurify"
import type { TokensList, Tokens } from "marked"
import { marked } from "marked"

DOMPurify.addHook("afterSanitizeAttributes", function (node) {
  const specialTags = ["H1", "H2", "H3", "H4", "H5", "H6", "BLOCKQUOTE", "CODE"]
  if (specialTags.includes(node.tagName)) {
    node.classList.add(node.tagName.toLowerCase())
  }
  if (node.tagName === "A") {
    node.setAttribute("target", "_blank")
    node.setAttribute("rel", "noopener")
    node.classList.add("anchor")
  }
})

export class MarkdownService {
  public partialParse(markdown: string) {
    const result: (string | Tokens.Code | Tokens.Generic)[] = []
    const tokens = marked.lexer(markdown)
    const tokenSections = this.separateCodeBlocks(tokens)
    for (const section of tokenSections) {
      if (section.length === 0) continue
      if (section[0].type !== "code") {
        const renderedSection = DOMPurify.sanitize(marked.parser(section), {
          USE_PROFILES: { html: true },
        })
        result.push(renderedSection)
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
