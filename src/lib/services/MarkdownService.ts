import DOMPurify from "dompurify"
import type { TokensList, Tokens, MarkedOptions } from "marked"
import { marked } from "marked"

const allowedDomains = [
  window.location.hostname,
  "i.imgur.com",
  "cdn.discordapp.com",
  "raw.githubusercontent.com",
  "c.tenor.com",
  "5e.tools",
]

DOMPurify.addHook("afterSanitizeAttributes", function (node) {
  const specialTags = ["H1", "H2", "H3", "H4", "H5", "H6", "BLOCKQUOTE", "CODE"]
  if (specialTags.includes(node.tagName)) {
    node.classList.add(node.tagName.toLowerCase())
  } else if (node.tagName === "INPUT" && node.getAttribute("type") === "checkbox") {
    node.classList.add("checkbox")
    node.removeAttribute("disabled")
  } else if (node.tagName === "A") {
    node.setAttribute("target", "_blank")
    node.setAttribute("rel", "noopener")
    node.classList.add("anchor")
  } else if (node.tagName === "TABLE") {
    node.classList.add("table", "table-hover")
  } else if (node.tagName === "IMG") {
    const src = node.getAttribute("src")
    if (!src) return
    const url = new URL(src, window.location.origin)
    if (!allowedDomains.includes(url.hostname)) {
      node.removeAttribute("src")
      node.setAttribute(
        "alt",
        `Domain not allowed. Allowed domains are ${allowedDomains.join(", ")}`
      )
    }
  }
})

export class MarkdownService {
  public partialParse(markdown: string) {
    const options: MarkedOptions = { gfm: true }
    const result: (string | Tokens.Code | Tokens.Generic)[] = []
    const tokens = marked.lexer(markdown, options)
    const tokenSections = this.separateCodeBlocks(tokens)
    for (const section of tokenSections) {
      if (section.length === 0) continue
      if (section[0].type !== "code") {
        const renderedSection = DOMPurify.sanitize(marked.parser(section, options), {
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
