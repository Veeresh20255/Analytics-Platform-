import React, { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import Plot from 'react-plotly.js';
import {
  AlertTriangle,
  FileSpreadsheet,
  History,
  Table2,
  Upload,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import CyanShell from '../components/CyanShell';

const MAX_HISTORY = 6;

function toKB(size) {
  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function detectDelimiter(csvText) {
  const firstLine = csvText.split('\n')[0] || '';
  if (firstLine.includes(';')) return ';';
  if (firstLine.includes('\t')) return '\t';
  return ',';
}

function getValidationSummary(rows) {
  if (!rows.length) {
    return { missing: 0, duplicate: 0, invalidColumns: 0 };
  }

  const keys = Object.keys(rows[0]);
  const missing = rows.reduce((count, row) => {
    const localMissing = keys.filter((key) => row[key] === null || row[key] === '').length;
    return count + localMissing;
  }, 0);

  const seen = new Set();
  let duplicate = 0;
  rows.forEach((row) => {
    const signature = JSON.stringify(row);
    if (seen.has(signature)) duplicate += 1;
    seen.add(signature);
  });

  const invalidColumns = keys.filter((key) => key.toLowerCase().includes('unnamed')).length;

  return { missing, duplicate, invalidColumns };
}

export default function Dashboard({ user, onDatasetChange, dataset }) {
  const [fileMeta, setFileMeta] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const [sheetName, setSheetName] = useState('');
  const [headerRow, setHeaderRow] = useState(true);
  const [skipBlankRows, setSkipBlankRows] = useState(true);
  const [delimiter, setDelimiter] = useState(',');
  const [graphMode, setGraphMode] = useState('2d-line');
  const [statusText, setStatusText] = useState('Upload Excel/CSV to enable preview and graph options.');
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('uploadHistory') || '[]');
    } catch {
      return [];
    }
  });

  const sheetNames = workbook?.SheetNames || [];

  const parsedRows = useMemo(() => {
    if (!workbook || !sheetName) return [];

    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, {
      defval: '',
      blankrows: !skipBlankRows,
      header: headerRow ? undefined : 1,
      raw: false,
    });

    if (!Array.isArray(data)) return [];

    if (headerRow) return data;

    if (!data.length) return [];
    const headers = data[0].map((value, index) => String(value || `Column ${index + 1}`));
    return data.slice(1).map((row) =>
      headers.reduce((acc, header, index) => {
        acc[header] = row[index] ?? '';
        return acc;
      }, {})
    );
  }, [workbook, sheetName, headerRow, skipBlankRows]);

  const previewRows = useMemo(() => parsedRows.slice(0, 10), [parsedRows]);

  const numericColumns = useMemo(() => {
    if (!parsedRows.length) return [];
    const keys = Object.keys(parsedRows[0]);
    return keys.filter((key) => parsedRows.some((row) => row[key] !== '' && !Number.isNaN(Number(row[key]))));
  }, [parsedRows]);

  const labelColumn = useMemo(() => {
    if (!parsedRows.length) return '';
    const keys = Object.keys(parsedRows[0]);
    const firstLabel = keys.find((key) => !numericColumns.includes(key));
    return firstLabel || keys[0];
  }, [parsedRows, numericColumns]);

  const graphData = useMemo(() => {
    if (!parsedRows.length || !numericColumns.length) return [];
    const metricA = numericColumns[0];
    const metricB = numericColumns[1] || numericColumns[0];

    return parsedRows.slice(0, 14).map((row, index) => ({
      label: String(row[labelColumn] || `Row ${index + 1}`).slice(0, 16),
      a: Number(row[metricA] || 0),
      b: Number(row[metricB] || 0),
      z: index + 1,
    }));
  }, [parsedRows, numericColumns, labelColumn]);

  const validation = useMemo(() => getValidationSummary(parsedRows), [parsedRows]);

  const onFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });
      const firstSheet = wb.SheetNames[0];
      const firstRows = XLSX.utils.sheet_to_json(wb.Sheets[firstSheet], {
        defval: '',
        raw: false,
      });
      setWorkbook(wb);
      setSheetName(firstSheet);
      setFileMeta({
        name: file.name,
        size: toKB(file.size),
        time: new Date().toLocaleString(),
        type: file.type,
      });

      if (file.name.toLowerCase().endsWith('.csv')) {
        const text = await file.text();
        setDelimiter(detectDelimiter(text));
      }

      setStatusText('File uploaded successfully. Choose graph type and apply import options.');

      if (onDatasetChange) {
        onDatasetChange({
          fileName: file.name,
          sheetName: firstSheet,
          uploadedAt: new Date().toISOString(),
          rows: firstRows,
        });
      }

      const nextHistory = [
        {
          name: file.name,
          size: toKB(file.size),
          time: new Date().toLocaleString(),
        },
        ...history,
      ].slice(0, MAX_HISTORY);
      setHistory(nextHistory);
      localStorage.setItem('uploadHistory', JSON.stringify(nextHistory));
    } catch {
      setStatusText('Failed to parse file. Please upload a valid .xlsx, .xls, or .csv file.');
    }
  };

  useEffect(() => {
    if (!dataset?.rows?.length || workbook || fileMeta) return;

    setStatusText(`Using shared dataset: ${dataset.fileName || 'Uploaded file'}`);
    setFileMeta({
      name: dataset.fileName || 'Uploaded file',
      size: 'From session',
      time: dataset.uploadedAt ? new Date(dataset.uploadedAt).toLocaleString() : 'Saved',
      type: 'application/json',
    });
  }, [dataset, workbook, fileMeta]);

  useEffect(() => {
    if (!onDatasetChange || !parsedRows.length || !fileMeta) return;

    onDatasetChange({
      fileName: fileMeta.name,
      sheetName,
      uploadedAt: new Date().toISOString(),
      rows: parsedRows,
    });
  }, [onDatasetChange, parsedRows, fileMeta, sheetName]);

  const reopenFromHistory = (item) => {
    setStatusText(`Open ${item.name} from local file picker to continue analysis.`);
  };

  const graph2D = (
    <div style={{ width: '100%', height: 300 }}>
      {graphMode === '2d-line' ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="a" stroke="#2ec7cb" strokeWidth={2.4} />
            <Line type="monotone" dataKey="b" stroke="#4ca3f5" strokeWidth={2.4} />
          </LineChart>
        </ResponsiveContainer>
      ) : graphMode === '2d-area' ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="a" stroke="#2ec7cb" fill="#2ec7cb66" />
            <Area type="monotone" dataKey="b" stroke="#4ca3f5" fill="#4ca3f544" />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="a" fill="#58d0c8" radius={[6, 6, 0, 0]} />
            <Bar dataKey="b" fill="#9bbaf6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );

  const surfaceData = useMemo(() => {
    if (!graphData.length) return { x: [], y: [], z: [] };

    const width = Math.min(5, graphData.length);
    const rows = [];
    for (let i = 0; i < graphData.length; i += width) {
      rows.push(graphData.slice(i, i + width));
    }

    const z = rows.map((row) => row.map((point) => point.a + point.b));
    const x = Array.from({ length: width }, (_, index) => `C${index + 1}`);
    const y = rows.map((_, index) => `R${index + 1}`);

    return { x, y, z };
  }, [graphData]);

  return (
    <CyanShell user={user}>
      <div className="dash-heading-row">
        <div>
          <h1>Upload Data</h1>
          <p>Import Excel/CSV files, validate data, preview rows, and choose 2D/3D graph types.</p>
        </div>
      </div>

      <section className="feature-bottom-grid">
        <article className="feature-panel">
          <header>
            <h2>Upload Area</h2>
          </header>

          <label className="upload-control">
            <Upload size={16} /> Drag & Drop or Browse File
            <input type="file" accept=".xlsx,.xls,.csv" onChange={onFileChange} />
          </label>

          <div className="feature-input-grid">
            <label className="feature-input-wrap">
              <span>Supported Formats</span>
              <input value=".xlsx, .xls, .csv" disabled readOnly />
            </label>

            <label className="feature-input-wrap">
              <span>Sheet Selection</span>
              <select value={sheetName} onChange={(e) => setSheetName(e.target.value)}>
                {sheetNames.map((sheet) => (
                  <option key={sheet} value={sheet}>{sheet}</option>
                ))}
              </select>
            </label>

            <label className="feature-input-wrap">
              <span>Header Row Selection</span>
              <select value={headerRow ? 'yes' : 'no'} onChange={(e) => setHeaderRow(e.target.value === 'yes')}>
                <option value="yes">First row is header</option>
                <option value="no">No header row</option>
              </select>
            </label>

            <label className="feature-input-wrap">
              <span>Skip Blank Rows</span>
              <select value={skipBlankRows ? 'yes' : 'no'} onChange={(e) => setSkipBlankRows(e.target.value === 'yes')}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>

            <label className="feature-input-wrap">
              <span>CSV Delimiter</span>
              <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)}>
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value={'\t'}>Tab</option>
              </select>
            </label>
          </div>

          {fileMeta && (
            <div className="feature-file-meta">
              <p><FileSpreadsheet size={14} /> {fileMeta.name}</p>
              <p>Size: {fileMeta.size}</p>
              <p>Upload time: {fileMeta.time}</p>
              <p>Selected sheet: {sheetName || 'N/A'}</p>
            </div>
          )}

          <p className="feature-action-message">{statusText}</p>
        </article>

        <article className="feature-panel">
          <header>
            <h2>Validation Check</h2>
          </header>

          <div className="feature-validation-grid">
            <p><AlertTriangle size={14} /> Missing values: {validation.missing}</p>
            <p><AlertTriangle size={14} /> Duplicate rows: {validation.duplicate}</p>
            <p><AlertTriangle size={14} /> Invalid columns: {validation.invalidColumns}</p>
          </div>

          <header>
            <h2 style={{ marginTop: 12 }}>Upload History</h2>
          </header>
          <div className="feature-activity-table">
            <div className="row head">
              <span>File</span>
              <span>Size</span>
              <span>Time</span>
            </div>
            {history.length === 0 && (
              <div className="row">
                <span>No uploads yet</span>
                <span className="pending">-</span>
                <span>Now</span>
              </div>
            )}
            {history.map((item) => (
              <button key={`${item.name}-${item.time}`} className="row feature-row-btn" type="button" onClick={() => reopenFromHistory(item)}>
                <span>{item.name}</span>
                <span>{item.size}</span>
                <span>{item.time}</span>
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="feature-bottom-grid">
        <article className="feature-panel">
          <header>
            <h2><Table2 size={16} /> Preview Table (first 10 rows)</h2>
          </header>
          <div className="feature-preview-table-wrap">
            <table className="feature-preview-table">
              <thead>
                <tr>
                  {(previewRows[0] ? Object.keys(previewRows[0]) : ['No data']).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.length === 0 && (
                  <tr>
                    <td colSpan={1}>Upload a file to see preview rows.</td>
                  </tr>
                )}
                {previewRows.map((row, rowIndex) => (
                  <tr key={`preview-${rowIndex}`}>
                    {Object.keys(previewRows[0]).map((key) => (
                      <td key={`${rowIndex}-${key}`}>{String(row[key])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="feature-bottom-grid">
        <article className="feature-panel">
          <header>
            <h2>Graph Options (2D and 3D)</h2>
          </header>

          <div className="feature-action-list">
            <button type="button" onClick={() => setGraphMode('2d-line')}>2D Line Graph</button>
            <button type="button" onClick={() => setGraphMode('2d-bar')}>2D Bar Graph</button>
            <button type="button" onClick={() => setGraphMode('2d-area')}>2D Area Graph</button>
            <button type="button" onClick={() => setGraphMode('3d-scatter')}>3D Scatter Graph</button>
            <button type="button" onClick={() => setGraphMode('3d-surface')}>3D Surface Graph</button>
          </div>

          {graphData.length === 0 ? (
            <p className="feature-action-message">Upload valid numeric data to visualize chart options.</p>
          ) : graphMode === '3d-scatter' ? (
            <Plot
              data={[
                {
                  x: graphData.map((point) => point.label),
                  y: graphData.map((point) => point.a),
                  z: graphData.map((point) => point.b + point.z),
                  type: 'scatter3d',
                  mode: 'markers',
                  marker: { size: 6, color: graphData.map((point) => point.a), colorscale: 'Viridis' },
                },
              ]}
              layout={{
                autosize: true,
                height: 320,
                margin: { l: 0, r: 0, b: 0, t: 20 },
                paper_bgcolor: '#ffffff',
              }}
              style={{ width: '100%' }}
              config={{ displaylogo: false, responsive: true }}
            />
          ) : graphMode === '3d-surface' ? (
            <Plot
              data={[
                {
                  type: 'surface',
                  x: surfaceData.x,
                  y: surfaceData.y,
                  z: surfaceData.z,
                  colorscale: 'Viridis',
                },
              ]}
              layout={{
                autosize: true,
                height: 320,
                margin: { l: 0, r: 0, b: 0, t: 20 },
                paper_bgcolor: '#ffffff',
                scene: {
                  xaxis: { title: 'Columns' },
                  yaxis: { title: 'Rows' },
                  zaxis: { title: 'Combined Value' },
                },
              }}
              style={{ width: '100%' }}
              config={{ displaylogo: false, responsive: true }}
            />
          ) : (
            graph2D
          )}
        </article>
      </section>
    </CyanShell>
  );
}
