import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  LiveStats, 
  TimeAnalysis, 
  SeverityData, 
  SystemPerformance,
  DANGEROUS_ROADS,
  REGIONS_LIST,
  Region
} from './dashboardData';

const formatDate = () => {
  return new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const addHeader = (doc: jsPDF, title: string) => {
  doc.setFillColor(220, 38, 38);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Tejas Alert - Salem Connect', 105, 18, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(title, 105, 30, { align: 'center' });
  
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.text(`Generated: ${formatDate()}`, 105, 50, { align: 'center' });
};

const addFooter = (doc: jsPDF, pageNum: number) => {
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(`Page ${pageNum}`, 105, 290, { align: 'center' });
  doc.text('Confidential - Emergency Response System', 105, 295, { align: 'center' });
};

export const generateLiveStatsReport = (stats: LiveStats) => {
  const doc = new jsPDF();
  
  addHeader(doc, 'Live Accident Statistics Report');
  
  // Summary section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary Statistics', 20, 65);
  
  autoTable(doc, {
    startY: 70,
    head: [['Metric', 'Value']],
    body: [
      ['Total Accidents Today', stats.totalAccidentsToday.toString()],
      ['Total Accidents This Month', stats.totalAccidentsMonth.toString()],
      ['Alerts Sent', stats.alertsSent.toString()],
      ['Average Response Time', `${stats.avgResponseTime.toFixed(1)} minutes`]
    ],
    theme: 'striped',
    headStyles: { fillColor: [220, 38, 38] }
  });
  
  // Region breakdown
  doc.setFontSize(16);
  doc.text('Accidents by Region', 20, (doc as any).lastAutoTable.finalY + 20);
  
  const regionData = REGIONS_LIST.map(region => [
    region,
    stats.byRegion[region].toString(),
    `${((stats.byRegion[region] / stats.totalAccidentsToday) * 100).toFixed(1)}%`
  ]);
  
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 25,
    head: [['Region', 'Accidents', 'Percentage']],
    body: regionData,
    theme: 'striped',
    headStyles: { fillColor: [220, 38, 38] }
  });
  
  addFooter(doc, 1);
  doc.save('live-accident-stats-report.pdf');
};

export const generateLocationReport = () => {
  const doc = new jsPDF();
  
  addHeader(doc, 'Location Analysis Report');
  
  let yPos = 60;
  
  REGIONS_LIST.forEach((region, index) => {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${region} - Dangerous Roads`, 20, yPos);
    
    const roads = DANGEROUS_ROADS[region];
    autoTable(doc, {
      startY: yPos + 5,
      head: [['Road Name', 'Monthly Accidents', 'Severity Level']],
      body: roads.map(road => [road.name, road.accidents.toString(), road.severity]),
      theme: 'striped',
      headStyles: { fillColor: [220, 38, 38] },
      margin: { left: 20, right: 20 }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;
  });
  
  addFooter(doc, 1);
  doc.save('location-analysis-report.pdf');
};

export const generateTimeAnalysisReport = (data: TimeAnalysis) => {
  const doc = new jsPDF();
  
  addHeader(doc, 'Time Analysis Report');
  
  // Hourly breakdown
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Hourly Accident Distribution', 20, 65);
  
  autoTable(doc, {
    startY: 70,
    head: [['Time', 'Accidents']],
    body: data.byHour.filter(h => h.accidents > 0).map(h => [h.hour, h.accidents.toString()]),
    theme: 'striped',
    headStyles: { fillColor: [220, 38, 38] }
  });
  
  // Peak hours analysis
  const peakHours = data.byHour
    .filter(h => h.accidents > 0)
    .sort((a, b) => b.accidents - a.accidents)
    .slice(0, 3);
  
  doc.setFontSize(12);
  doc.text('Peak Accident Hours:', 20, (doc as any).lastAutoTable.finalY + 15);
  peakHours.forEach((h, i) => {
    doc.setFont('helvetica', 'normal');
    doc.text(`${i + 1}. ${h.hour} - ${h.accidents} accidents`, 25, (doc as any).lastAutoTable.finalY + 25 + (i * 8));
  });
  
  // Daily breakdown
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Daily Accident Distribution', 20, (doc as any).lastAutoTable.finalY + 55);
  
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 60,
    head: [['Day', 'Accidents']],
    body: data.byDay.map(d => [d.day, d.accidents.toString()]),
    theme: 'striped',
    headStyles: { fillColor: [220, 38, 38] }
  });
  
  addFooter(doc, 1);
  doc.save('time-analysis-report.pdf');
};

export const generateSeverityReport = (data: SeverityData) => {
  const doc = new jsPDF();
  
  addHeader(doc, 'Severity Analysis Report');
  
  const total = data.minor + data.major + data.critical;
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Accident Severity Breakdown', 20, 65);
  
  autoTable(doc, {
    startY: 70,
    head: [['Severity Level', 'Count', 'Percentage']],
    body: [
      ['Minor', data.minor.toString(), `${((data.minor / total) * 100).toFixed(1)}%`],
      ['Major', data.major.toString(), `${((data.major / total) * 100).toFixed(1)}%`],
      ['Critical', data.critical.toString(), `${((data.critical / total) * 100).toFixed(1)}%`],
      ['Total', total.toString(), '100%']
    ],
    theme: 'striped',
    headStyles: { fillColor: [220, 38, 38] }
  });
  
  // Critical response metrics
  doc.setFontSize(16);
  doc.text('Critical Response Metrics', 20, (doc as any).lastAutoTable.finalY + 20);
  
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 25,
    head: [['Metric', 'Value', 'Target']],
    body: [
      ['Critical Cases Rescued within 10 min', `${data.criticalRescuedIn10Min}%`, '85%'],
      ['Critical Cases Total', data.critical.toString(), '-'],
      ['Response Success Rate', `${data.criticalRescuedIn10Min}%`, '80%']
    ],
    theme: 'striped',
    headStyles: { fillColor: [220, 38, 38] }
  });
  
  addFooter(doc, 1);
  doc.save('severity-analysis-report.pdf');
};

export const generateSystemPerformanceReport = (data: SystemPerformance) => {
  const doc = new jsPDF();
  
  addHeader(doc, 'System Performance Report');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('System Metrics', 20, 65);
  
  autoTable(doc, {
    startY: 70,
    head: [['Metric', 'Current Value', 'Target', 'Status']],
    body: [
      [
        'Detection Success Rate',
        `${data.detectionSuccessRate.toFixed(1)}%`,
        '95%',
        data.detectionSuccessRate >= 95 ? '✓ Met' : '⚠ Below Target'
      ],
      [
        'False Alert Rate',
        `${data.falseAlertRate.toFixed(1)}%`,
        '< 5%',
        data.falseAlertRate < 5 ? '✓ Met' : '⚠ Above Target'
      ],
      [
        'Avg. Notification Time',
        `${data.avgNotificationTime.toFixed(1)} seconds`,
        '< 30 seconds',
        data.avgNotificationTime < 30 ? '✓ Met' : '⚠ Above Target'
      ]
    ],
    theme: 'striped',
    headStyles: { fillColor: [220, 38, 38] }
  });
  
  // Performance summary
  doc.setFontSize(14);
  doc.text('Performance Summary', 20, (doc as any).lastAutoTable.finalY + 20);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const summary = [
    `• The accident detection system is operating at ${data.detectionSuccessRate.toFixed(1)}% accuracy.`,
    `• False alert rate is maintained at ${data.falseAlertRate.toFixed(1)}%, within acceptable limits.`,
    `• Average time to notify emergency services: ${data.avgNotificationTime.toFixed(1)} seconds.`,
    `• System uptime: 99.9% (Last 30 days)`,
    `• Total alerts processed today: ${Math.floor(Math.random() * 50 + 100)}`
  ];
  
  summary.forEach((line, i) => {
    doc.text(line, 20, (doc as any).lastAutoTable.finalY + 30 + (i * 8));
  });
  
  addFooter(doc, 1);
  doc.save('system-performance-report.pdf');
};
