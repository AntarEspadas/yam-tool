export class FileService {
  public download(content: string, filename: string) {
    const a = document.createElement("a")
    a.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`)
    a.setAttribute("download", filename)

    a.click()
  }
}

export const fileService = new FileService()
