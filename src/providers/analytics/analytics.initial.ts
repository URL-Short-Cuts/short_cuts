import { voidFn } from "../../utils/voids";
import type { AnalyticsContextInterface } from "../../types/analytics/provider.d";

const InitialValues = <AnalyticsContextInterface>{
  initialized: false,
  setInitialized: voidFn,
  setTrackingRoutes: voidFn,
  trackingRoutes: false,
};

export default InitialValues;
