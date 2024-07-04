export class FileService {
  public download(content: string, filename: string) {
    const a = document.createElement("a")
    a.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`)
    a.setAttribute("download", filename)

    a.click()
  }

  public readAsText(file: Blob) {
    const reader = new FileReader()
    const promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(reader.error)
    })
    reader.readAsText(file)
    return promise
  }
}

export const fileService = new FileService()
