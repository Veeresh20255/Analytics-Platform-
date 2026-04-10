import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function UploadCard({ onDataParsed, loading, setLoading, fileName }) {
  const [error, setError] = useState('');

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles?.[0];
      if (!file) return;

      setError('');
      setLoading(true);
      try {
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
        onDataParsed(rows, file.name);
      } catch {
        setError('Invalid file. Upload a valid .xlsx or .csv file.');
      } finally {
        setLoading(false);
      }
    },
    [onDataParsed, setLoading]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`rounded-[18px] border-2 border-dashed p-6 text-center cursor-pointer transition-all h-full min-h-[118px] flex flex-col justify-center shadow-[0_8px_20px_rgba(15,23,42,0.06)] ${
        isDragActive
          ? 'border-teal-500 bg-teal-50'
          : 'border-[#97deda] bg-gradient-to-r from-[#4dcfd2] via-[#55ccd6] to-[#5ec5de] hover:border-teal-500'
      }`}
    >
      <input {...getInputProps()} />
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-white/60 border-t-white rounded-full animate-spin" />
          <p className="mt-3 text-white font-semibold">Processing file...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center gap-3 text-white">
            <UploadCloud size={26} />
            <FileSpreadsheet size={22} className="text-white/95" />
          </div>
          <p className="mt-3 text-white font-semibold text-[13px]">Drop your Excel or CSV file here</p>
          <p className="text-[11px] text-white/90 mt-1">or click to browse files</p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white">xlsx</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white">csv</span>
          </div>
        </>
      )}

      {fileName && !loading && <p className="mt-2 text-xs text-white font-medium">Loaded: {fileName}</p>}
      {error && <p className="mt-2 text-xs text-red-100">{error}</p>}
    </div>
  );
}
