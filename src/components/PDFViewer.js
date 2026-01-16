import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { X, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ onClose, onExtractText }) => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [extracting, setExtracting] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setPageNumber(1);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const extractText = async () => {
    if (!file) return;

    setExtracting(true);
    try {
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const typedarray = new Uint8Array(e.target.result);
        const pdf = await pdfjs.getDocument(typedarray).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n\n';
        }

        onExtractText(fullText);
        setExtracting(false);
      };
      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error extracting text:', error);
      alert('Failed to extract text from PDF');
      setExtracting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold dark:text-white">PDF Viewer</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5 dark:text-white" />
          </button>
        </div>

        {/* Upload Area */}
        {!file && (
          <div className="flex-1 flex items-center justify-center p-8">
            <label className="flex flex-col items-center gap-4 cursor-pointer">
              <Upload className="w-16 h-16 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">Click to upload PDF</span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Choose File
              </span>
            </label>
          </div>
        )}

        {/* PDF Display */}
        {file && (
          <>
            <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                className="flex justify-center"
              >
                <Page pageNumber={pageNumber} />
              </Document>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between p-4 border-t dark:border-gray-700">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                  disabled={pageNumber <= 1}
                  className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 dark:text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm dark:text-white">
                  Page {pageNumber} of {numPages}
                </span>
                <button
                  onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                  disabled={pageNumber >= numPages}
                  className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 dark:text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={extractText}
                disabled={extracting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {extracting ? 'Extracting...' : 'Ask AI About This PDF'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;