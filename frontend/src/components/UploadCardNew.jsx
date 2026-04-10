import React, { useState, useCallback } from 'react';
import { Upload, File, X } from 'lucide-react';
import * as XLSX from 'xlsx';

const UploadCard = ({ onFileUpload }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(
    async (file) => {
      if (!file) return;

      // Validate file type
      const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'application/vnd.ms-excel'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload an Excel or CSV file');
        return;
      }

      setLoading(true);
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const binaryString = e.target.result;
          const workbook = XLSX.read(binaryString, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

          setUploadedFile({
            name: file.name,
            data: data,
            sheetName: sheetName,
          });

          onFileUpload({
            name: file.name,
            data: data,
            sheetName: sheetName,
          });
        };
        reader.readAsBinaryString(file);
      } catch (error) {
        alert('Error reading file: ' + error.message);
      } finally {
        setLoading(false);
      }
    },
    [onFileUpload]
  );

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className="w-full">
      {!uploadedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative p-12 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group ${
            isDragActive
              ? 'border-teal-500 bg-teal-50/50 shadow-glass-lg'
              : 'border-white/40 bg-white/30 hover:bg-white/40 hover:border-teal-400 shadow-glass'
          }`}
        >
          <input
            type="file"
            onChange={handleChange}
            accept=".xlsx,.xls,.csv"
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={loading}
          />

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-full transition-all ${isDragActive ? 'bg-teal-100' : 'bg-teal-50 group-hover:bg-teal-100'}`}>
                <Upload
                  size={32}
                  className={`transition-colors ${isDragActive ? 'text-teal-600' : 'text-teal-500 group-hover:text-teal-600'}`}
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {loading ? 'Processing...' : 'Drop your Excel or CSV file here'}
            </h3>
            <p className="text-sm text-slate-500">or click to browse</p>
            <p className="text-xs text-slate-400 mt-2">Supports .xlsx, .xls, and .csv files</p>
          </div>

          {loading && (
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <div className="animate-spin">
                <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-teal-50 border border-green-200/50 shadow-glass">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <File size={24} className="text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">{uploadedFile.name}</h4>
                <p className="text-sm text-slate-500 mt-1">
                  Uploaded successfully · Sheet: {uploadedFile.sheetName}
                </p>
                <p className="text-sm text-slate-500">
                  Rows: {uploadedFile.data.length}
                </p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCard;
