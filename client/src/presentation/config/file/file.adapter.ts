export class FileAdapter {
    static readAsDataURL = (file: File): Promise<string | ArrayBuffer | null> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.onerror = (error) => {
                reject(error);
            }
        });
    };
}