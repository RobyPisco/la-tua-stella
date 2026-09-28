/**
 * Device orientation as a rotation matrix from screen coordinates (x right, y up, z out of
 * the screen) to the local east-north-up frame, following the W3C DeviceOrientation spec.
 */
export type Matrix3 = [number, number, number, number, number, number, number, number, number];

const RAD = Math.PI / 180;

interface IOSOrientationEvent extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

type PermissionFn = () => Promise<'granted' | 'denied'>;

export function orientationSupported(): boolean {
  return 'DeviceOrientationEvent' in window && matchMedia('(pointer: coarse)').matches;
}

/** Must be called from a user gesture: iOS asks for permission here. */
export async function requestOrientation(): Promise<boolean> {
  const req = (DeviceOrientationEvent as unknown as { requestPermission?: PermissionFn }).requestPermission;
  if (!req) return true;
  try {
    return (await req()) === 'granted';
  } catch {
    return false;
  }
}

function matrix(alpha: number, beta: number, gamma: number, screenAngle: number): Matrix3 {
  const cA = Math.cos(alpha * RAD), sA = Math.sin(alpha * RAD);
  const cB = Math.cos(beta * RAD), sB = Math.sin(beta * RAD);
  const cG = Math.cos(gamma * RAD), sG = Math.sin(gamma * RAD);
  // Device frame → earth frame (spec, Z-X'-Y'' intrinsic rotations).
  const d = [
    cA * cG - sA * sB * sG, -cB * sA, cG * sA * sB + cA * sG,
    cG * sA + cA * sB * sG, cA * cB, sA * sG - cA * cG * sB,
    -cB * sG, sB, cB * cG,
  ];
  // Screen frame differs from the device frame when the UI is rotated to landscape.
  const cS = Math.cos(screenAngle * RAD), sS = Math.sin(screenAngle * RAD);
  const r: number[] = [];
  for (let i = 0; i < 3; i++) {
    const a = d[i * 3], b = d[i * 3 + 1];
    r.push(a * cS - b * sS, a * sS + b * cS, d[i * 3 + 2]);
  }
  return r as Matrix3;
}

/**
 * Streams orientation matrices. Resolves to a stop function. `onmissing` fires if no
 * compass reading arrives (desktop, or a phone without a magnetometer).
 */
export function watchOrientation(onmatrix: (m: Matrix3) => void, onmissing: () => void): () => void {
  const absolute = 'ondeviceorientationabsolute' in window;
  const type = absolute ? 'deviceorientationabsolute' : 'deviceorientation';
  let got = false;

  const handler = (e: Event) => {
    const ev = e as IOSOrientationEvent;
    if (ev.beta == null || ev.gamma == null) return;
    let alpha: number | null = null;
    if (typeof ev.webkitCompassHeading === 'number' && ev.webkitCompassHeading >= 0) {
      alpha = 360 - ev.webkitCompassHeading; // iOS: heading is clockwise from north
    } else if (absolute || ev.absolute) {
      alpha = ev.alpha;
    }
    if (alpha == null) return;
    got = true;
    onmatrix(matrix(alpha, ev.beta, ev.gamma, screen.orientation?.angle ?? 0));
  };

  window.addEventListener(type, handler);
  const timer = setTimeout(() => { if (!got) onmissing(); }, 2500);
  return () => {
    clearTimeout(timer);
    window.removeEventListener(type, handler);
  };
}

/** Earth-frame vector → screen frame (the transpose, since the matrix is orthonormal). */
export function toScreen(m: Matrix3, v: readonly number[]): [number, number, number] {
  return [
    m[0] * v[0] + m[3] * v[1] + m[6] * v[2],
    m[1] * v[0] + m[4] * v[1] + m[7] * v[2],
    m[2] * v[0] + m[5] * v[1] + m[8] * v[2],
  ];
}
