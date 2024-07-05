export class FileService {
  public download(content: Blob, filename: string) {
    const url = URL.createObjectURL(content)
    const a = document.createElement("a")
    a.setAttribute("href", url)
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
