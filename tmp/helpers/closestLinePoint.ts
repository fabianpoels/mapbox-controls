type P = [number, number];

/**
 * Find the closest point on the line AB from the point P
 */
export default function closestLinePoint(a: P, b: P, p: P): P {
  const u = [p[0] - a[0], p[1] - a[1]]; // vector a->p
  const v = [b[0] - a[0], b[1] - a[1]]; // vector a->b
  const v2 = v[0] ** 2 + v[1] ** 2;
  const vu = v[0] * u[0] + v[1] * u[1]; // dot product of v and u
  const t = vu / v2;

  return [a[0] + v[0] * t, a[1] + v[1] * t];
}
