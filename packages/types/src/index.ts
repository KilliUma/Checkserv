// ========================================
// 🔐 AUTH & USER TYPES
// ========================================

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'LAB_TECHNICIAN' | 'CUSTOMER_USER' | 'READONLY'
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  status: UserStatus
  customerId?: string
  avatar?: string
  phone?: string
  emailVerified?: Date
  preferences?: UserPreferences
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

export interface UserPreferences {
  notifications: {
    email: boolean
    sms?: boolean
    inApp: boolean
  }
  language: 'pt' | 'en' | 'es'
  timezone: string
  theme?: 'light' | 'dark' | 'auto'
}

// ========================================
// 🏢 CUSTOMER TYPES
// ========================================

export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'TRIAL' | 'SUSPENDED'

export interface Customer {
  id: string
  name: string
  tradingName?: string
  registrationNo?: string
  status: CustomerStatus
  email: string
  phone?: string
  website?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country: string
  createdAt: Date
  updatedAt: Date
}

// ========================================
// 🛠️ EQUIPMENT TYPES
// ========================================

export type EquipmentStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'DECOMMISSIONED'

export interface Equipment {
  id: string
  equipmentNo: string
  description: string
  serialNumber?: string
  manufacturer?: string
  model?: string
  year?: number
  status: EquipmentStatus
  customerId: string
  siteId?: string
  currentReading?: number
  readingUnit?: 'hours' | 'km'
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export type ComponentType =
  | 'ENGINE'
  | 'TRANSMISSION'
  | 'HYDRAULIC_SYSTEM'
  | 'GEARBOX'
  | 'DIFFERENTIAL'
  | 'COOLANT_SYSTEM'
  | 'FUEL_SYSTEM'
  | 'COMPRESSOR'
  | 'TURBINE'
  | 'BEARING'
  | 'OTHER'

export interface Component {
  id: string
  componentNo: string
  type: ComponentType
  description: string
  equipmentId: string
  manufacturer?: string
  model?: string
  serialNumber?: string
  compartment?: string
  fluidType?: string
  fluidGrade?: string
  fluidCapacity?: number
  serviceInterval?: number
  lastService?: Date
  nextService?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// ========================================
// 🧪 SAMPLE TYPES
// ========================================

export type SampleStatus =
  | 'SUBMITTED'
  | 'RECEIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REPORTED'
  | 'ERROR'
  | 'CANCELLED'

export type SampleType = 'ROUTINE' | 'RESAMPLE' | 'NEW_EQUIPMENT' | 'INVESTIGATION' | 'POST_MAINTENANCE'

export type SamplePriority = 'NORMAL' | 'HIGH' | 'URGENT'

export interface Sample {
  id: string
  sampleNumber: string
  batchId?: string
  customerId: string
  siteId?: string
  equipmentId: string
  componentId?: string
  type: SampleType
  status: SampleStatus
  priority: SamplePriority
  equipmentReading?: number
  fluidType?: string
  fluidGrade?: string
  hoursSinceChange?: number
  fluidAdded?: number
  receivedAt?: Date
  analyzedAt?: Date
  reportedAt?: Date
  labTechnicianId?: string
  customerComment?: string
  labComment?: string
  submittedBy: string
  createdAt: Date
  updatedAt: Date
}

// ========================================
// 🔬 TEST RESULT TYPES
// ========================================

export type TestType =
  | 'SPECTROMETRIC'
  | 'VISCOSITY'
  | 'TAN'
  | 'TBN'
  | 'WATER_CONTENT'
  | 'FUEL_DILUTION'
  | 'OXIDATION'
  | 'NITRATION'
  | 'SULFATION'
  | 'GLYCOL'
  | 'PARTICLE_COUNT'
  | 'FERROUS_DENSITY'
  | 'PQ_INDEX'
  | 'FLASH_POINT'
  | 'OTHER'

export type Severity = 'NORMAL' | 'CAUTION' | 'CRITICAL' | 'SEVERE'

export interface TestResult {
  id: string
  sampleId: string
  testType: TestType
  testName: string
  value?: number
  unit?: string
  textResult?: string
  normalMin?: number
  normalMax?: number
  cautionMax?: number
  criticalMax?: number
  severity: Severity
  outOfSpec: boolean
  trendUp: boolean
  trendDown: boolean
  comment?: string
  metadata?: Record<string, any>
  createdAt: Date
}

// ========================================
// 📊 REPORT TYPES
// ========================================

export type ReportStatus = 'QUEUED' | 'GENERATING' | 'READY' | 'SENT' | 'READ' | 'ARCHIVED'

export interface Report {
  id: string
  sampleId: string
  customerId: string
  reportNumber: string
  status: ReportStatus
  pdfUrl?: string
  pdfPages?: number
  pdfGeneratedAt?: Date
  recommendation?: string
  problemType?: string
  actionRequired?: string
  summary?: ReportSummary
  emailSentAt?: Date
  emailSentTo: string[]
  readAt?: Date
  readBy?: string
  createdAt: Date
  updatedAt: Date
}

export interface ReportSummary {
  overallStatus: Severity
  criticalFindings: number
  cautionFindings: number
  normalFindings: number
  keyFindings?: string[]
  recommendations?: string[]
}

// ========================================
// 💬 FEEDBACK TYPES
// ========================================

export type FeedbackType = 'REPORT_FEEDBACK' | 'SAMPLE_FEEDBACK' | 'GENERAL_FEEDBACK' | 'COMPLAINT' | 'SUGGESTION'

export type FeedbackStatus = 'PENDING' | 'IN_REVIEW' | 'RESOLVED' | 'CLOSED'

export interface Feedback {
  id: string
  type: FeedbackType
  status: FeedbackStatus
  subject?: string
  message: string
  rating?: number
  sampleId?: string
  reportId?: string
  userId: string
  response?: string
  respondedAt?: Date
  respondedBy?: string
  createdAt: Date
  updatedAt: Date
}

// ========================================
// 🔔 NOTIFICATION TYPES
// ========================================

export type NotificationType =
  | 'SAMPLE_RECEIVED'
  | 'REPORT_READY'
  | 'CRITICAL_RESULT'
  | 'SYSTEM_ALERT'
  | 'FEEDBACK_RESPONSE'
  | 'MAINTENANCE_DUE'

export type NotificationChannel = 'EMAIL' | 'SMS' | 'IN_APP' | 'PUSH'

export interface Notification {
  id: string
  type: NotificationType
  channel: NotificationChannel
  userId: string
  title: string
  message: string
  data?: Record<string, any>
  actionUrl?: string
  sent: boolean
  sentAt?: Date
  read: boolean
  readAt?: Date
  retryCount: number
  createdAt: Date
}

// ========================================
// 📝 API RESPONSE TYPES
// ========================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  count?: number
  pagination?: Pagination
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

// ========================================
// 📊 ANALYTICS TYPES
// ========================================

export interface DashboardStats {
  totalSamples: number
  pendingSamples: number
  completedSamples: number
  criticalAlerts: number
  reportsReady: number
  activeEquipment: number
}

export interface TrendData {
  date: string
  value: number
  severity?: Severity
}

export interface SeveritySummary {
  normal: number
  caution: number
  critical: number
  severe: number
}

export interface ProblemTypeSummary {
  type: string
  count: number
  percentage: number
}

// ========================================
// 🏷️ FORM TYPES
// ========================================

export interface SampleSubmissionForm {
  equipmentId: string
  componentId?: string
  siteId?: string
  type: SampleType
  priority: SamplePriority
  equipmentReading?: number
  fluidType?: string
  fluidGrade?: string
  hoursSinceChange?: number
  fluidAdded?: number
  customerComment?: string
}

export interface EquipmentForm {
  equipmentNo: string
  description: string
  manufacturer?: string
  model?: string
  year?: number
  serialNumber?: string
  siteId?: string
  currentReading?: number
  readingUnit?: 'hours' | 'km'
  tags?: string[]
}

export interface ComponentForm {
  componentNo: string
  type: ComponentType
  description: string
  manufacturer?: string
  model?: string
  serialNumber?: string
  compartment?: string
  fluidType?: string
  fluidGrade?: string
  fluidCapacity?: number
  serviceInterval?: number
}

// ========================================
// 📅 DATE RANGE TYPES
// ========================================

export interface DateRange {
  from: Date
  to: Date
}

export type DateRangePreset = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'custom'
