import React from 'react';

interface DownloadButtonProps {
  pdfBlob?: Blob;
  fileName?: string;
  disabled?: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ pdfBlob, fileName = 'report.pdf', disabled }) => {
  const handleDownload = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  return (
    <button onClick={handleDownload} disabled={!pdfBlob || disabled} className="bg-green-600 text-white px-4 py-2 rounded">
      Download PDF
    </button>
  );
};

export default DownloadButton;
