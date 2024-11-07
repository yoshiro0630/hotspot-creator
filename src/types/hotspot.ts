export interface CTA {
  type: 'url' | 'message';
  value: string;
  label?: string;
  pauseDuration?: string;
}

export interface HotspotStyle {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
}

export interface ResponsivePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ResponsiveSettings {
  desktop: ResponsivePosition;
  tablet: ResponsivePosition;
  mobile: ResponsivePosition;
}

export interface Hotspot {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  startTime: number;
  endTime: number;
  shape: 'rectangle' | 'circle';
  opacity?: number;
  ctas: CTA[];
  style: HotspotStyle;
  responsive: ResponsiveSettings;
  isActive?: boolean;
}