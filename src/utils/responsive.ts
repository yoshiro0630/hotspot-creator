interface ResponsivePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DeviceBreakpoints {
  desktop: number;
  tablet: number;
  mobile: number;
}

const breakpoints: DeviceBreakpoints = {
  desktop: 1920,
  tablet: 768,
  mobile: 375,
};

export const calculateResponsivePosition = (
  position: ResponsivePosition,
  currentWidth: number,
  deviceType: 'desktop' | 'tablet' | 'mobile'
): ResponsivePosition => {
  const baseWidth = breakpoints[deviceType];
  const scale = currentWidth / baseWidth;

  return {
    x: position.x * scale,
    y: position.y * scale,
    width: position.width * scale,
    height: position.height * scale,
  };
};