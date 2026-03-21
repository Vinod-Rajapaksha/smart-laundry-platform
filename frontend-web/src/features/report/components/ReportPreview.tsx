import React from 'react';

interface ReportPreviewProps {
  pdfUrl?: string;
  pdfBlob?: Blob;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ pdfUrl, pdfBlob }) => {
  let src = pdfUrl;
  if (!src && pdfBlob) {
    src = URL.createObjectURL(pdfBlob);
  }
  if (!src) return <div className="text-gray-400">No preview available.</div>;
  return (
    <iframe
      src={src}
      title="Report Preview"
      width="100%"
      height="600px"
      style={{ border: '1px solid #ccc', borderRadius: 4 }}
    />
  );
};

export default ReportPreview;
