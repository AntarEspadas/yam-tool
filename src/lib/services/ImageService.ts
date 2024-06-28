export class ImageService {
	public fileToDataUrl(blob: Blob) {
		const reader = new FileReader();
		const promise = new Promise<string>((resolve, reject) => {
			reader.onload = () => {
				resolve(reader.result as string);
			};
			reader.onerror = () => {
				reject(reader.error);
			};
		});
		reader.readAsDataURL(blob);
		return promise;
	}
}

export const imageService = new ImageService();
