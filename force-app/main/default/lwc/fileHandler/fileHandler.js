import { LightningElement, track } from 'lwc';

export default class FileHandler extends LightningElement {
    @track fileContent = '';
    @track fileUrl = '';

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.fileContent = reader.result; // Read file content
                const blob = new Blob([this.fileContent], { type: file.type });
                this.fileUrl = URL.createObjectURL(blob); // Generate URL for preview
            };
            reader.readAsText(file);
        }
    }

    downloadFile() {
        if (this.fileContent) {
            const blob = new Blob([this.fileContent], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'processedFile.txt';
            link.click();
            URL.revokeObjectURL(link.href);
        }
    }
}