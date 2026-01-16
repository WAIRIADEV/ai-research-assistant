import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { X, ChevronLeft, ChevronRight, Upload } from 'lucide-react';

// Fix PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ onClose, onExtractText }) => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setPageNumber(1);
      setError(null);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF. Please try a different file.');
  };

  const extractText = async () => {
    if (!file) return;

    setExtracting(true);
    try {
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        try {
          const typedarray = new Uint8Array(e.target.result);
          const loadingTask = pdfjs.getDocument(typedarray);
          const pdf = await loadingTask.promise;
          let fullText = '';

          for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n\n';
          }

          if (fullText.trim()) {
            onExtractText(fullText);
          } else {
            alert('No text could be extracted from this PDF');
          }
          setExtracting(false);
        } catch (err) {
          console.error('Extraction error:', err);
          alert('Failed to extract text from PDF');
          setExtracting(false);
        }
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
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 flex-shrink-0">
          <h3 className="text-lg font-semibold dark:text-white">PDF Viewer</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 dark:text-white" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Upload Area */}
        {!file && (
          <div className="flex-1 flex items-center justify-center p-8">
            <label className="flex flex-col items-center gap-4 cursor-pointer">
              <Upload className="w-16 h-16 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300 text-center">
                Click to upload PDF
              </span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
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
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="text-gray-600 dark:text-gray-300">
                    Loading PDF...
                  </div>
                }
              >
                <Page 
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-lg"
                />
              </Document>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between p-4 border-t dark:border-gray-700 flex-shrink-0 gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                  disabled={pageNumber <= 1}
                  className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 dark:text-white" />
                </button>
                <span className="text-sm dark:text-white whitespace-nowrap">
                  Page {pageNumber} of {numPages}
                </span>
                <button
                  onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                  disabled={pageNumber >= numPages}
                  className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 dark:text-white" />
                </button>
              </div>

              <button
                onClick={extractText}
                disabled={extracting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
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