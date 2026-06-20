export const mockHistory = [
  { batchId: "EV-1024", issue: "Capacity Failure", rootCause: "Coating thickness variation", confidence: 91, severity: "High", date: "2026-06-18", status: "Completed" },
  { batchId: "EV-1023", issue: "Internal Resistance Spike", rootCause: "Welding pressure variation", confidence: 86, severity: "Medium", date: "2026-06-17", status: "Completed" },
  { batchId: "EV-1022", issue: "Thermal Instability", rootCause: "Drying temperature deviation", confidence: 89, severity: "High", date: "2026-06-16", status: "Completed" },
  { batchId: "EV-1021", issue: "Electrolyte Leakage", rootCause: "Sealing pressure inconsistency", confidence: 82, severity: "Medium", date: "2026-06-15", status: "Completed" },
  { batchId: "EV-1020", issue: "Low Voltage Output", rootCause: "Cathode material inconsistency", confidence: 78, severity: "Medium", date: "2026-06-14", status: "Under Review" },
  { batchId: "EV-1019", issue: "Formation Cycle Delay", rootCause: "Electrolyte wetting inconsistency", confidence: 84, severity: "Medium", date: "2026-06-13", status: "Completed" },
  { batchId: "EV-1018", issue: "Humidity Excursion", rootCause: "Dry room humidity deviation", confidence: 88, severity: "High", date: "2026-06-12", status: "Completed" },
  { batchId: "EV-1017", issue: "Tab Welding Defect", rootCause: "Welding current instability", confidence: 81, severity: "Medium", date: "2026-06-11", status: "Completed" },
  { batchId: "EV-1016", issue: "Capacity Fade", rootCause: "Cathode material contamination", confidence: 76, severity: "High", date: "2026-06-10", status: "Under Review" },
  { batchId: "EV-1015", issue: "Seal Integrity Failure", rootCause: "Sealing pressure drift", confidence: 83, severity: "Medium", date: "2026-06-09", status: "Completed" },
  { batchId: "EV-1014", issue: "High Self-Discharge", rootCause: "Separator contamination", confidence: 79, severity: "Medium", date: "2026-06-08", status: "Under Review" },
  { batchId: "EV-1013", issue: "Thermal Hotspot", rootCause: "Formation temperature deviation", confidence: 85, severity: "High", date: "2026-06-07", status: "Completed" },
  { batchId: "EV-1012", issue: "Coating Defect", rootCause: "Slurry viscosity variation", confidence: 90, severity: "High", date: "2026-06-06", status: "Completed" },
  { batchId: "EV-1011", issue: "Electrolyte Fill Error", rootCause: "Fill volume inconsistency", confidence: 77, severity: "Medium", date: "2026-06-05", status: "Completed" },
  { batchId: "EV-1010", issue: "Resistance Drift", rootCause: "Aging chamber temperature variation", confidence: 80, severity: "Medium", date: "2026-06-04", status: "Completed" },
];

export const failureDistributionData = [
  { name: "Capacity Failure", value: 42 },
  { name: "Internal Resistance", value: 28 },
  { name: "Thermal Instability", value: 18 },
  { name: "Welding Defect", value: 15 },
  { name: "Electrolyte Leakage", value: 10 },
];

export const rootCausePieData = [
  { name: "Process Deviation", value: 38 },
  { name: "Machine Calibration", value: 27 },
  { name: "Environmental Conditions", value: 20 },
  { name: "Material Quality", value: 15 },
];

export const investigationTrendData = [
  { month: "Jan", count: 18 },
  { month: "Feb", count: 22 },
  { month: "Mar", count: 26 },
  { month: "Apr", count: 31 },
  { month: "May", count: 29 },
  { month: "Jun", count: 34 },
];

export const kpiData = [
  { label: "Total Investigations", value: "128", trend: "+18 this month", icon: "Search", color: "#3B82F6" },
  { label: "Avg Confidence", value: "87%", trend: "+4.2% vs last month", icon: "TrendingUp", color: "#22C55E" },
  { label: "Critical Failures", value: "14", trend: "5 open high-severity", icon: "AlertTriangle", color: "#EF4444" },
  { label: "Open Investigations", value: "9", trend: "3 awaiting review", icon: "Clock", color: "#F59E0B" },
];

export const mockInvestigation = {
  batchId: "EV-1024",
  failureType: "Capacity Testing Failure",
  productionLine: "Coating Line A",
  confidence: 91,
  severity: "High",
  status: "Completed",
  summary: "Batch EV-1024 failed capacity validation after abnormal coating thickness variation and humidity deviation were detected during electrode preparation and drying stages.",
  rootCause: "The primary root cause is electrode coating thickness variation, likely caused by calibration drift in Coating Line A and humidity levels exceeding the allowed SOP threshold.",
  evidenceSources: [
    "SOP-001: Electrode coating thickness tolerance must remain within ±2%.",
    "SOP-002: Humidity must remain below 60% during electrode preparation.",
    "Historical Case EV-1001: Similar capacity failure linked to coating variation.",
    "Maintenance Log: Coating Line A calibration overdue by 10 days.",
    "Sensor Reading: Humidity reached 72%, temperature 36°C, coating thickness deviation +8%.",
  ],
  sopReferences: ["SOP-001 Coating Thickness Tolerance", "SOP-002 Humidity Control", "SOP-003 Cell Drying Temperature"],
  historicalIncidents: ["EV-1001 Capacity Failure", "EV-1012 Coating Defect", "EV-1018 Humidity Excursion"],
  maintenanceRecords: ["Coating Line A calibration overdue", "Drying Chamber B inspection pending"],
  sensorReadings: ["Humidity: 72%", "Temperature: 36°C", "Coating deviation: +8%"],
  correctiveActions: [
    "Recalibrate Coating Line A immediately.",
    "Reinspect affected electrode sheets.",
    "Repeat capacity testing on retained samples.",
    "Validate humidity-control system.",
  ],
  preventiveActions: [
    "Add automated coating thickness drift alerts.",
    "Schedule stricter preventive maintenance.",
    "Add humidity threshold alerts before batch release.",
    "Create automated batch risk scoring.",
  ],
  contributingFactors: ["Humidity deviation", "Calibration drift", "Delayed maintenance"],
  impact: "Reduced cell capacity and inconsistent active material distribution",
};

export const reportData = {
  reportId: "CS-RPT-2026-1024",
  batchId: "EV-1024",
  generatedDate: "18 June 2026",
  status: "Completed",
  confidence: 91,
  severity: "High",
  executiveSummary: "CellSage AI investigated the capacity testing failure in Batch EV-1024 using SOP references, historical incident data, maintenance records, and sensor readings. The investigation identified electrode coating thickness variation as the most likely root cause, supported by humidity deviation and overdue calibration records.",
  findings: [
    "Capacity test results were below acceptance threshold.",
    "Humidity exceeded the SOP limit during electrode preparation.",
    "Coating thickness deviation reached +8%.",
    "Similar historical incidents were linked to coating calibration drift.",
    "Coating Line A maintenance was overdue.",
  ],
  evidenceSources: [
    "SOP-001: Electrode coating thickness tolerance ±2%.",
    "SOP-002: Humidity must remain below 60%.",
    "Historical Failure EV-1001: Similar capacity failure caused by coating variation.",
    "Maintenance Record: Coating Line A calibration overdue by 10 days.",
    "Sensor Log: Humidity 72%, temperature 36°C, coating deviation +8%.",
  ],
  rootCauseAnalysis: "The primary root cause is coating thickness variation caused by calibration drift in Coating Line A. Environmental humidity deviation likely contributed to inconsistent electrode quality and reduced cell capacity.",
  correctiveActions: [
    "Recalibrate Coating Line A immediately.",
    "Quarantine affected electrode sheets.",
    "Repeat capacity testing on sample cells.",
    "Inspect humidity control systems.",
  ],
  preventiveActions: [
    "Add automated sensor alerts.",
    "Introduce predictive maintenance checks.",
    "Add pre-release batch risk scoring.",
    "Link SOP deviations with investigation workflows.",
  ],
  confidenceAssessment: "CellSage AI assigns a 91% confidence score based on strong alignment between SOP violations, historical failure patterns, sensor anomalies, and maintenance records.",
};
