import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import HomeDashboard from './pages/HomeDashboard';
import IrrigationControl from './pages/IrrigationControl';
import FertigationScheduler from './pages/FertigationScheduler';
import WaterQuality from './pages/WaterQuality';
import AlertsLogs from './pages/AlertsLogs';
import Settings from './pages/Settings';
import About from './pages/About';
import { SensorProvider } from './context/SensorContext';
import { ThemeProvider } from './context/ThemeContext';
import NotificationToast from './components/NotificationToast';

function App() {
  return (
    <ThemeProvider>
      <SensorProvider>
        <Router>
          <div className="flex min-h-screen bg-transparent text-slate-900 dark:text-white transition-colors duration-300">
            <NotificationToast />
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-agri-green/5 via-transparent to-transparent">
                <Routes>
                  <Route path="/" element={<HomeDashboard />} />
                  <Route path="/index.html" element={<HomeDashboard />} />
                  <Route path="/irrigation" element={<IrrigationControl />} />
                  <Route path="/fertigation" element={<FertigationScheduler />} />
                  <Route path="/water-quality" element={<WaterQuality />} />
                  <Route path="/alerts" element={<AlertsLogs />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/about" element={<About />} />
                  <Route path="*" element={<div className="p-8"><h1 className="text-2xl font-bold">Route Not Found: {window.location.pathname}</h1></div>} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </SensorProvider>
    </ThemeProvider>
  );
}

export default App;
