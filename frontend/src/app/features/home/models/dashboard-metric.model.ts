import type { DashboardCounts } from './dashboard-counts.model';
import type { MetricTone } from '../../../shared/models/metric-tone.model';
export interface DashboardMetric {
  key: keyof DashboardCounts;
  label: string;
  description: string;
  tone: MetricTone;
}
