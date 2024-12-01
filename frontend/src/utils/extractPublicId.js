

export default function extractPublicId(url) {
    try {
        const parts = url.split('/');
        const fileWithExtension = parts.pop();
        return fileWithExtension.split('.')[0]; // Remove the file extension
    } catch (error) {
        console.error('Invalid URL:', error);
        return null;
    }
}