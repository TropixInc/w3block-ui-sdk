import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

interface PDFProps {
  src: string;
}

const PDF = ({ src }: PDFProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onLoadSuccess = (numPages: number) => {
    setNumPages(numPages);
    setIsLoading(true);
  };

  return (
    <>
      <Document
        file={src}
        onLoadSuccess={({ numPages }) => onLoadSuccess(numPages)}
        className={
          isLoading ? 'pw-h-[500px] pw-w-[631px] pw-overflow-scroll' : ''
        }
      >
        <Page
          pageNumber={pageNumber}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      </Document>
      {numPages && numPages > 1 && (
        <div className="pw-flex">
          <button
            className="pw-mr-2 disabled:pw-text-gray-400"
            onClick={() => setPageNumber(pageNumber - 1)}
            disabled={pageNumber == 1}
          >
            {'<'}
          </button>
          Page {pageNumber} of {numPages}
          <button
            className="pw-ml-2 disabled:pw-text-gray-400"
            onClick={() => setPageNumber(pageNumber + 1)}
            disabled={pageNumber == numPages}
          >
            {'>'}
          </button>
        </div>
      )}
    </>
  );
};

export default PDF;
