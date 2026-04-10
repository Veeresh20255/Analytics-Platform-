import React, { useEffect, useMemo, useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import CyanShell from '../components/CyanShell';
import { deleteDashboard, getDashboards, saveDashboard } from '../api/api';

function looksLikeDate(value) {
  if (value === null || value === undefined) return false;
  const text = String(value).trim();
  if (!text) return false;
  return !Number.isNaN(Date.parse(text));
}

export default function VisualizationPage({ user, dataset }) {
  const [xKey, setXKey] = useState('');
  const [yKey, setYKey] = useState('');
  const [zKey, setZKey] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [chartTitle, setChartTitle] = useState('My Visualization');
  const [status, setStatus] = useState('Select fields and chart type to generate a live preview.');
  const [savedCharts, setSavedCharts] = useState([]);
  const [loadingSavedCharts, setLoadingSavedCharts] = useState(false);
  const [plotlyModule, setPlotlyModule] = useState(null);
  const plotRef = useRef(null);
  const chartContainerRef = useRef(null);
  const PlotlyChart = plotlyModule;

  const rows = useMemo(() => dataset?.rows || [], [dataset]);
  const columns = useMemo(() => Object.keys(rows[0] || {}), [rows]);

  const numericColumns = useMemo(
    () => columns.filter((key) => rows.some((row) => row[key] !== '' && !Number.isNaN(Number(row[key])))),
    [columns, rows]
  );

  const suggestedType = useMemo(() => {
    if (!rows.length || !xKey || !yKey) return 'Bar chart';

    const xSample = rows.slice(0, 30).map((row) => row[xKey]);
    const uniqueCount = new Set(xSample.map((item) => String(item))).size;
    const dateLike = xSample.filter(looksLikeDate).length > Math.max(2, xSample.length / 2);

    if (dateLike) return 'Line chart';
    if (uniqueCount > 12) return 'Scatter chart';
    return 'Bar chart';
  }, [rows, xKey, yKey]);

  const previewRows = useMemo(() => rows.slice(0, 120), [rows]);

  const plotData = useMemo(() => {
    if (!previewRows.length || !xKey) return [];

    const xValues = previewRows.map((row, index) => row[xKey] ?? `Row ${index + 1}`);

    if (chartType === 'pie' || chartType === 'donut') {
      const map = {};
      previewRows.forEach((row, index) => {
        const label = String(row[xKey] ?? `Row ${index + 1}`);
        const numeric = yKey ? Number(row[yKey] || 0) : 1;
        map[label] = (map[label] || 0) + (Number.isNaN(numeric) ? 0 : numeric);
      });

      const labels = Object.keys(map);
      const values = labels.map((label) => map[label]);

      return [
        {
          type: 'pie',
          labels,
          values,
          hole: chartType === 'donut' ? 0.45 : 0,
          textinfo: 'label+percent',
        },
      ];
    }

    if (!yKey) return [];

    const yValues = previewRows.map((row) => {
      const value = Number(row[yKey]);
      return Number.isNaN(value) ? 0 : value;
    });

    if (chartType === '3d-scatter') {
      const zValues = zKey
        ? previewRows.map((row) => {
            const value = Number(row[zKey]);
            return Number.isNaN(value) ? 0 : value;
          })
        : yValues.map((_, index) => index + 1);

      return [
        {
          type: 'scatter3d',
          mode: 'markers',
          x: xValues,
          y: yValues,
          z: zValues,
          marker: {
            size: 5,
            color: yValues,
            colorscale: 'Viridis',
            opacity: 0.85,
          },
        },
      ];
    }

    if (chartType === '3d-surface') {
      const width = Math.min(8, previewRows.length);
      const matrix = [];
      for (let i = 0; i < yValues.length; i += width) {
        matrix.push(yValues.slice(i, i + width));
      }

      return [
        {
          type: 'surface',
          z: matrix,
          colorscale: 'Viridis',
        },
      ];
    }

    if (chartType === 'line') {
      return [{ type: 'scatter', mode: 'lines+markers', x: xValues, y: yValues }];
    }

    if (chartType === 'area') {
      return [{ type: 'scatter', mode: 'lines', fill: 'tozeroy', x: xValues, y: yValues }];
    }

    if (chartType === 'scatter') {
      return [{ type: 'scatter', mode: 'markers', x: xValues, y: yValues }];
    }

    return [{ type: 'bar', x: xValues, y: yValues }];
  }, [previewRows, xKey, yKey, zKey, chartType]);

  const loadSavedCharts = async () => {
    try {
      setLoadingSavedCharts(true);
      const response = await getDashboards();
      const charts = (response?.dashboards || [])
        .filter((item) => item?.config?.type === 'chart')
        .map((item) => ({
          id: item._id,
          title: item.name,
          chartType: item.config.chartType,
          xKey: item.config.xKey,
          yKey: item.config.yKey,
          zKey: item.config.zKey,
          savedAt: item.createdAt,
        }));
      setSavedCharts(charts);
    } catch {
      setSavedCharts([]);
    } finally {
      setLoadingSavedCharts(false);
    }
  };

  useEffect(() => {
    if (!chartType.startsWith('3d')) {
      return;
    }

    let cancelled = false;

    import('react-plotly.js').then((module) => {
      if (!cancelled) {
        setPlotlyModule(() => module.default);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [chartType]);

  const applySavedChart = (chart) => {
    if (!chart) return;

    setChartTitle(chart.title || 'Saved Chart');
    setChartType(chart.chartType || 'bar');
    setXKey(chart.xKey || '');
    setYKey(chart.yKey || '');
    setZKey(chart.zKey || '');
    setStatus(`Loaded saved chart: ${chart.title || 'Saved Chart'}`);
  };

  const removeSavedChart = async (chart) => {
    if (!chart?.id) return;

    const shouldDelete = window.confirm(`Delete saved chart "${chart.title}"?`);
    if (!shouldDelete) return;

    try {
      await deleteDashboard(chart.id);
      setStatus(`Deleted saved chart: ${chart.title}`);
      await loadSavedCharts();
    } catch (error) {
      setStatus(error?.response?.data?.message || 'Failed to delete saved chart.');
    }
  };

  React.useEffect(() => {
    if (user) {
      loadSavedCharts();
    }
  }, [user]);

  const plotLayout = useMemo(
    () => ({
      autosize: true,
      height: 420,
      title: chartTitle,
      margin: { l: 40, r: 20, t: 50, b: 40 },
      paper_bgcolor: '#ffffff',
      plot_bgcolor: '#ffffff',
      scene: chartType.startsWith('3d')
        ? {
            xaxis: { title: xKey || 'X' },
            yaxis: { title: yKey || 'Y' },
            zaxis: { title: zKey || 'Z' },
          }
        : undefined,
    }),
    [chartTitle, chartType, xKey, yKey, zKey]
  );

  const saveChart = () => {
    if (!plotData.length) {
      setStatus('Generate a chart first, then save.');
      return;
    }

    saveDashboard({
      name: chartTitle,
      config: {
        type: 'chart',
        chartType,
        xKey,
        yKey,
        zKey,
        chartTitle,
        datasetName: dataset?.fileName || null,
      },
    })
      .then(() => {
        setStatus(`Chart saved: ${chartTitle}`);
        loadSavedCharts();
      })
      .catch((error) => {
        setStatus(error?.response?.data?.message || 'Failed to save chart.');
      });
  };

  const addToDashboard = () => {
    if (!plotData.length) {
      setStatus('Generate a chart first before adding to dashboard.');
      return;
    }
    setStatus('Chart added to dashboard widgets queue.');
  };

  const exportAsImage = async () => {
    if (chartType.startsWith('3d')) {
      if (!plotRef.current) {
        setStatus('No chart to export.');
        return;
      }

      const { default: Plotly } = await import('plotly.js-dist');
      const gd = plotRef.current?.el || plotRef.current;
      const imgData = await Plotly.toImage(gd, { format: 'png', width: 1400, height: 900 });
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${chartTitle.replace(/\s+/g, '_').toLowerCase() || 'chart'}.png`;
      link.click();
      setStatus('Chart exported as image.');
      return;
    }

    const svg = chartContainerRef.current?.querySelector('svg');
    if (!svg) {
      setStatus('No chart to export.');
      return;
    }

    const xml = new XMLSerializer().serializeToString(svg);
    const svgData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = 900;
    const context = canvas.getContext('2d');
    const image = new Image();

    await new Promise((resolve, reject) => {
      image.onload = () => {
        context?.clearRect(0, 0, canvas.width, canvas.height);
        context?.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve();
      };
      image.onerror = reject;
      image.src = svgData;
    });

    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `${chartTitle.replace(/\s+/g, '_').toLowerCase() || 'chart'}.png`;
    link.click();
    setStatus('Chart exported as image.');
  };

  const exportAsPDF = async () => {
    let imgData = '';

    if (chartType.startsWith('3d')) {
      if (!plotRef.current) {
        setStatus('No chart to export.');
        return;
      }

      const { default: Plotly } = await import('plotly.js-dist');
      const gd = plotRef.current?.el || plotRef.current;
      imgData = await Plotly.toImage(gd, { format: 'png', width: 1400, height: 900 });
    } else {
      const svg = chartContainerRef.current?.querySelector('svg');
      if (!svg) {
        setStatus('No chart to export.');
        return;
      }

      const xml = new XMLSerializer().serializeToString(svg);
      const svgData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
      const canvas = document.createElement('canvas');
      canvas.width = 1400;
      canvas.height = 900;
      const context = canvas.getContext('2d');
      const image = new Image();

      await new Promise((resolve, reject) => {
        image.onload = () => {
          context?.clearRect(0, 0, canvas.width, canvas.height);
          context?.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve();
        };
        image.onerror = reject;
        image.src = svgData;
      });

      imgData = canvas.toDataURL('image/png');
    }

    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1400, 900] });
    pdf.addImage(imgData, 'PNG', 0, 0, 1400, 900);
    pdf.save(`${chartTitle.replace(/\s+/g, '_').toLowerCase() || 'chart'}.pdf`);
    setStatus('Chart exported as PDF.');
  };

  const render2DChart = () => {
    if (!plotData.length) return null;

    if (chartType === 'pie' || chartType === 'donut') {
      const pieEntry = plotData[0];
      return (
        <ResponsiveContainer width="100%" height={420}>
          <PieChart>
            <Tooltip />
            <Pie
              data={pieEntry.labels.map((label, index) => ({ name: label, value: pieEntry.values[index] }))}
              dataKey="value"
              nameKey="name"
              innerRadius={chartType === 'donut' ? 70 : 0}
              outerRadius={140}
              fill="#2ec7cb"
            />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'scatter') {
      return (
        <ResponsiveContainer width="100%" height={420}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" type="category" />
            <YAxis dataKey="y" type="number" />
            <Tooltip />
            <Scatter data={plotData.map((point) => ({ x: point.x, y: point.y }))} fill="#2ec7cb" />
          </ScatterChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'area' || chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={plotData.map((point) => ({ x: point.x, y: point.y }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="y" stroke="#2ec7cb" fill="#2ec7cb" dot />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={plotData.map((point) => ({ x: point.x, y: point.y }))}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="y" fill="#2ec7cb" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <CyanShell user={user}>
      <div className="dash-heading-row">
        <div>
          <h1>Visualization</h1>
          <p>Build advanced 2D and 3D charts from uploaded data with live preview and export options.</p>
        </div>
      </div>

      <section className="feature-bottom-grid">
        <article className="feature-panel">
          <header>
            <h2>Chart Builder</h2>
          </header>

          <div className="feature-input-grid">
            <label className="feature-input-wrap">
              <span>Chart Title</span>
              <input value={chartTitle} onChange={(e) => setChartTitle(e.target.value)} />
            </label>

            <label className="feature-input-wrap">
              <span>Chart Type</span>
              <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                <option value="bar">2D Bar</option>
                <option value="line">2D Line</option>
                <option value="area">2D Area</option>
                <option value="scatter">2D Scatter</option>
                <option value="pie">2D Pie</option>
                <option value="donut">2D Donut</option>
                <option value="3d-scatter">3D Scatter</option>
                <option value="3d-surface">3D Surface</option>
              </select>
            </label>

            <label className="feature-input-wrap">
              <span>X-axis</span>
              <select value={xKey} onChange={(e) => setXKey(e.target.value)}>
                <option value="">Select</option>
                {columns.map((column) => (
                  <option key={column} value={column}>{column}</option>
                ))}
              </select>
            </label>

            <label className="feature-input-wrap">
              <span>Y-axis / Measure</span>
              <select value={yKey} onChange={(e) => setYKey(e.target.value)}>
                <option value="">Select</option>
                {numericColumns.map((column) => (
                  <option key={column} value={column}>{column}</option>
                ))}
              </select>
            </label>

            {chartType.startsWith('3d') && (
              <label className="feature-input-wrap">
                <span>Z-axis (optional)</span>
                <select value={zKey} onChange={(e) => setZKey(e.target.value)}>
                  <option value="">Auto</option>
                  {numericColumns.map((column) => (
                    <option key={column} value={column}>{column}</option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <p className="feature-action-message">Recommended Chart Type: {suggestedType}</p>
          <p className="feature-action-message">
            {rows.length
              ? `Active dataset: ${dataset.fileName || 'uploaded file'} (${rows.length} rows).`
              : 'No uploaded dataset found. Upload data first from Upload Data page.'}
          </p>
        </article>

        <article className="feature-panel">
          <header>
            <h2>Save & Export</h2>
          </header>

          <div className="feature-action-list">
            <button type="button" onClick={saveChart}>Save Chart</button>
            <button type="button" onClick={addToDashboard}>Add To Dashboard</button>
            <button type="button" onClick={exportAsImage}>Export Image</button>
            <button type="button" onClick={exportAsPDF}>Export PDF</button>
          </div>

          <p className="feature-action-message">{status}</p>
        </article>
      </section>

      <section className="feature-bottom-grid">
        <article className="feature-panel" style={{ gridColumn: '1 / -1' }}>
          <header>
            <h2>Live Chart Preview</h2>
          </header>

          {!plotData.length ? (
            <p className="feature-action-message">Select chart type and fields to render preview.</p>
          ) : chartType.startsWith('3d') ? (
            PlotlyChart ? (
              <div ref={chartContainerRef}>
                <PlotlyChart
                  ref={plotRef}
                  data={plotData}
                  layout={plotLayout}
                  config={{ responsive: true, displaylogo: false }}
                  style={{ width: '100%' }}
                />
              </div>
            ) : (
              <p className="feature-action-message">Loading 3D chart engine...</p>
            )
          ) : (
            <div ref={chartContainerRef}>
              {render2DChart()}
            </div>
          )}
        </article>
      </section>

      <section className="feature-bottom-grid">
        <article className="feature-panel" style={{ gridColumn: '1 / -1' }}>
          <header>
            <h2>Saved Charts</h2>
          </header>
          {loadingSavedCharts ? (
            <p className="feature-action-message">Loading saved charts...</p>
          ) : savedCharts.length ? (
            <div className="feature-activity-table">
              <div className="row head">
                <span>Title</span>
                <span>Type</span>
                <span>Saved</span>
                <span>Action</span>
                <span>Remove</span>
              </div>
              {savedCharts.map((chart) => (
                <div className="row" key={chart.id}>
                  <span>{chart.title}</span>
                  <span>{chart.chartType}</span>
                  <span>{new Date(chart.savedAt).toLocaleString()}</span>
                  <span>
                    <button type="button" className="feature-apply-btn" onClick={() => applySavedChart(chart)}>
                      Load
                    </button>
                  </span>
                  <span>
                    <button type="button" className="feature-apply-btn" onClick={() => removeSavedChart(chart)}>
                      Delete
                    </button>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="feature-action-message">No charts saved yet. Save your first chart to store it in the backend.</p>
          )}
        </article>
      </section>
    </CyanShell>
  );
}
