import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

interface PDFProps {
  src: string;
}

const PDF = ({ src }: PDFProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onLoadSuccess = (numPages: number) => {
    setNumPages(numPages);
    setIsLoading(true);
  };

  return (
    <Document
      file={src}
      onLoadSuccess={({ numPages }) => onLoadSuccess(numPages)}
      className={
        isLoading ? 'pw-h-[500px] pw-w-[631px] pw-overflow-scroll' : ''
      }
    >
      {Array(numPages ?? 0)
        .fill(undefined)
        .map((_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        ))}
    </Document>
  );
};

export default PDF;
