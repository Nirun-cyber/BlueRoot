import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { 
  Bell, 
  Trash2, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Download,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useSensors } from '../context/SensorContext';
import { StatusBadge } from '../components/Common';

const AlertsLogs: React.FC = () => {
  const { alerts, logs } = useSensors();
  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [emailAlerts, setEmailAlerts] = React.useState(true);

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // --- Header & Branding ---
    doc.setFillColor(0, 115, 230); // BlueRoot Primary Blue
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('BlueRoot', 15, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('SMART FARM OS - ANALYTICS REPORT', 15, 33);
    
    doc.text(`Generated: ${date}`, 150, 25);
    doc.text('System Healthy', 150, 31);

    // --- Section 1: Alert Summary ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('1. System Health Summary', 15, 55);
    
    const summaryData = [
      ['Total Errors', alerts.filter(a => a.type === 'error').length],
      ['Total Warnings', alerts.filter(a => a.type === 'warning').length],
      ['Total Info Logs', alerts.filter(a => a.type === 'info').length],
      ['System Uptime', '99.9%'],
      ['Critical Faults', '0']
    ];

    (doc as any).autoTable({
      startY: 65,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [76, 175, 80] }, // BlueRoot Primary Green
    });

    // --- Section 2: Recent Alerts ---
    const nextY = (doc as any).lastAutoTable.finalY + 15;
    doc.text('2. Recent System Alerts', 15, nextY);
    
    const alertRows = alerts.map(a => [a.timestamp, a.type.toUpperCase(), a.message]);
    (doc as any).autoTable({
      startY: nextY + 10,
      head: [['Timestamp', 'Type', 'Description']],
      body: alertRows.length > 0 ? alertRows : [['-', 'No Alerts', 'System is performing optimally.']],
      theme: 'grid',
      headStyles: { fillColor: [0, 115, 230] },
    });

    // --- Section 3: Activity Logs ---
    const logY = (doc as any).lastAutoTable.finalY + 15;
    doc.text('3. Detailed Activity Log', 15, logY);
    
    const logRows = logs.map(l => [l.timestamp, l.type.toUpperCase(), `Triggered to ${l.action}`]);
    (doc as any).autoTable({
      startY: logY + 10,
      head: [['Timestamp', 'Module', 'Action Taken']],
      body: logRows.length > 0 ? logRows : [['-', 'No Logs', 'No recent activities recorded.']],
      theme: 'striped',
      headStyles: { fillColor: [76, 175, 80] },
    });

    // --- Footer ---
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`BlueRoot Tech - Futuristic Agriculture Management Platform | Page ${i} of ${pageCount}`, 15, 285);
    }

    doc.save(`BlueRoot_Monthly_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const alertIconMap: Record<string, React.ReactNode> = {
    error: <AlertCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    success: <CheckCircle2 size={20} />,
    info: <Info size={20} />,
  };

  const alertColorMap: Record<string, string> = {
    error: 'bg-red-50 dark:bg-red-500/10 text-red-500',
    warning: 'bg-amber-50 dark:bg-amber-500/10 text-amber-500',
    success: 'bg-green-50 dark:bg-[#1e9a4e]/10 text-[#1e9a4e]',
    info: 'bg-blue-50 dark:bg-blue-500/10 text-blue-500',
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-800 dark:text-white">
            <Bell size={32} className="text-red-500" />
            Alerts & Logs
          </h2>
          <p className="text-slate-500 dark:text-white/40 font-medium">Historical record of system events and safety triggers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alert List + Activity Log */}
        <div className="lg:col-span-2 space-y-6">
          {/* Alerts panel */}
          <div className="glass rounded-[2rem] border border-[#1e9a4e]/40 shadow-[0_0_20px_rgba(30,154,78,0.15)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white">Recent Alerts</h3>
              <button className="text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg transition-all">
                <Trash2 size={18} />
              </button>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-white/5">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-6 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <div className={`p-3 rounded-2xl shrink-0 ${alertColorMap[alert.type] || alertColorMap.info}`}>
                    {alertIconMap[alert.type] || alertIconMap.info}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <StatusBadge 
                        status={
                          alert.type === 'error' ? 'error' : 
                          alert.type === 'warning' ? 'warning' : 
                          alert.type === 'success' ? 'healthy' : 'active'
                        } 
                      />
                      <span className="text-xs font-medium text-slate-400 dark:text-white/40 whitespace-nowrap">{alert.timestamp}</span>
                    </div>
                    <p className="font-semibold text-sm text-slate-700 dark:text-white/80">{alert.message}</p>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="p-12 text-center text-slate-400 dark:text-white/40 font-medium">
                  ✓ No active alerts. System is performing optimally.
                </div>
              )}
            </div>
          </div>

          {/* Activity Log */}
          <div className="glass rounded-[2rem] border border-[#1e9a4e]/40 shadow-[0_0_20px_rgba(30,154,78,0.15)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/5">
              <h3 className="font-bold text-slate-800 dark:text-white">System Activity Log</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center gap-4 text-sm py-2 border-b border-slate-50 dark:border-white/5 last:border-0">
                    <div className="w-16 text-xs font-bold text-slate-400 dark:text-white/40 shrink-0">{log.timestamp.split(' ')[0]}</div>
                    <div className="flex-1 flex items-center gap-2 flex-wrap">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${log.type === 'irrigation' ? 'bg-blue-500' : 'bg-purple-500'}`}></span>
                      <span className="font-bold uppercase tracking-wider text-[10px] text-slate-600 dark:text-white/60">{log.type}</span>
                      <span className="text-slate-500 dark:text-white/60">system was triggered to</span>
                      <span className={`font-bold ${log.action === 'START' ? 'text-[#1e9a4e]' : 'text-red-500'}`}>{log.action}</span>
                    </div>
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-center py-4 text-slate-400 dark:text-white/40 text-sm">No activity records yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Report generation */}
          <div className="glass rounded-3xl p-6 border border-[#1e9a4e]/40 shadow-[0_0_20px_rgba(30,154,78,0.15)] bg-green-50/30 dark:bg-[#1e9a4e]/5">
            <h4 className="font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
              <Download size={18} className="text-[#1e9a4e]" />
              Report Generation
            </h4>
            <p className="text-xs text-slate-500 dark:text-white/60 mb-6 leading-relaxed">
              Generate detailed PDF reports of all alerts and activity for the past 30 days.
            </p>
            <button 
              onClick={handleDownloadReport}
              className="w-full py-3 rounded-xl bg-[#1e9a4e] text-white font-bold text-sm shadow-lg shadow-[#1e9a4e]/20 hover:bg-[#187a3e] transition-all"
            >
              Download Monthly Report
            </button>
          </div>

          {/* Notification Settings */}
          <div className="glass rounded-3xl p-6 border border-[#1e9a4e]/40 shadow-[0_0_20px_rgba(30,154,78,0.15)]">
            <h4 className="font-bold mb-4 text-slate-800 dark:text-white">Notification Settings</h4>
            <div className="space-y-4">
              {[
                { label: 'Push Notifications', enabled: pushNotifications, toggle: () => setPushNotifications(!pushNotifications) },
                { label: 'Email Alerts', enabled: emailAlerts, toggle: () => setEmailAlerts(!emailAlerts) },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-white/70">{item.label}</span>
                  <button onClick={item.toggle} className="focus:outline-none">
                    {item.enabled 
                      ? <ToggleRight size={28} className="text-[#1e9a4e]" />
                      : <ToggleLeft size={28} className="text-slate-300 dark:text-white/20" />
                    }
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Summary stats */}
          <div className="glass rounded-3xl p-6 border border-[#1e9a4e]/40 shadow-[0_0_20px_rgba(30,154,78,0.15)]">
            <h4 className="font-bold mb-4 text-slate-800 dark:text-white">Alert Summary</h4>
            <div className="space-y-3">
              {[
                { label: 'Errors', count: alerts.filter(a => a.type === 'error').length, color: 'text-red-500 bg-red-50 dark:bg-red-500/10' },
                { label: 'Warnings', count: alerts.filter(a => a.type === 'warning').length, color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
                { label: 'Info', count: alerts.filter(a => a.type === 'info').length, color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
                { label: 'Resolved', count: alerts.filter(a => a.type === 'success').length, color: 'text-[#1e9a4e] bg-green-50 dark:bg-[#1e9a4e]/10' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-white/60">{item.label}</span>
                  <span className={`text-xs font-black px-2 py-1 rounded-lg ${item.color}`}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsLogs;
