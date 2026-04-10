import React, { useState } from 'react';
import SidebarNew from './SidebarNew';
import NavbarNew from './NavbarNew';
import UploadCardNew from './UploadCardNew';
import StatsCardsNew from './StatsCardsNew';
import ChartsSectionNew from './ChartsSectionNew';
import ActionBarNew from './ActionBarNew';

const DashboardNew = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (data) => {
    setFileData(data);
  };

  const handleDataCleaning = () => {
    alert('Data Cleaning feature coming soon!');
  };

  const handleFiltering = () => {
    alert('Filtering feature coming soon!');
  };

  const handleTransform = () => {
    alert('Data Transform feature coming soon!');
  };

  const handleInsights = () => {
    alert('AI Insights feature coming soon!');
  };

  const handleDownload = () => {
    if (!fileData) {
      alert('No data to download');
      return;
    }
    alert('Download feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Sidebar */}
      <SidebarNew isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Navbar */}
        <NavbarNew user={user} onLogout={onLogout} />

        {/* Page Content */}
        <main className="p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Upload Data File</h1>
              <p className="text-lg text-slate-600 mt-2">
                Export spreadsheets (.xlsx, .csv) for analysis
              </p>
            </div>

            {/* Upload Section */}
            <div className="p-8 rounded-2xl bg-white/40 backdrop-blur-md border border-white/30 shadow-glass">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Choose a File to Upload
              </h2>
              <UploadCardNew onFileUpload={handleFileUpload} />
            </div>

            {/* Show Stats and Charts only after file upload */}
            {fileData && (
              <>
                {/* Stats Cards */}
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">
                    Key Metrics
                  </h2>
                  <StatsCardsNew data={fileData} />
                </div>

                {/* Charts */}
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">
                    Data Visualization
                  </h2>
                  <ChartsSectionNew fileData={fileData} isLoading={loading} />
                </div>

                {/* Action Bar */}
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">
                    Tools & Actions
                  </h2>
                  <ActionBarNew
                    onDataCleaning={handleDataCleaning}
                    onFiltering={handleFiltering}
                    onTransform={handleTransform}
                    onInsights={handleInsights}
                    onDownload={handleDownload}
                    hasData={!!fileData}
                  />
                </div>
              </>
            )}

            {/* Empty State */}
            {!fileData && (
              <div className="p-12 rounded-2xl bg-white/40 backdrop-blur-md border border-white/30 shadow-glass text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                  No Data Uploaded Yet
                </h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  Upload an Excel or CSV file above to see your data visualized with charts, 
                  statistics, and actionable insights.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardNew;
