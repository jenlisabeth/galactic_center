const assert = require("node:assert/strict");

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

function julianDate(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hours = date.getUTCHours() + date.getUTCMinutes() / 60
    + date.getUTCSeconds() / 3600 + date.getUTCMilliseconds() / 3600000;
  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716))
    + Math.floor(30.6001 * (m + 1))
    + day
    + hours / 24
    + b
    - 1524.5;
}

function localSiderealTime(date, lon) {
  const jd = julianDate(date);
  const d = jd - 2451545.0;
  const gmstHours = 18.697374558 + 24.06570982441908 * d;
  return normalizeDegrees(gmstHours * 15 + lon);
}

function calculateAzAlt(date, lat, lon, rightAscensionDeg, declinationDeg) {
  const lstDeg = localSiderealTime(date, lon);
  const hourAngleDeg = normalizeSignedDegrees(lstDeg - rightAscensionDeg);
  const hourAngle = hourAngleDeg * DEG_TO_RAD;
  const latitude = lat * DEG_TO_RAD;
  const declination = declinationDeg * DEG_TO_RAD;
  const sinAlt = Math.sin(declination) * Math.sin(latitude)
    + Math.cos(declination) * Math.cos(latitude) * Math.cos(hourAngle);
  const altitude = Math.asin(clamp(sinAlt, -1, 1));
  const cosAlt = Math.cos(altitude);
  let azimuth = 0;

  if (Math.abs(cosAlt) > 0.0001) {
    const cosAz = clamp(
      (Math.sin(declination) - Math.sin(altitude) * Math.sin(latitude))
        / (cosAlt * Math.cos(latitude)),
      -1,
      1
    );
    const sinAz = clamp((-Math.cos(declination) * Math.sin(hourAngle)) / cosAlt, -1, 1);
    azimuth = Math.atan2(sinAz, cosAz);
  }

  return {
    azimuth: normalizeDegrees(azimuth * RAD_TO_DEG),
    altitude: altitude * RAD_TO_DEG
  };
}

function normalizeDegrees(value) {
  return ((value % 360) + 360) % 360;
}

function normalizeSignedDegrees(value) {
  return ((value + 180) % 360 + 360) % 360 - 180;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function closeTo(actual, expected, tolerance = 1e-6) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`
  );
}

closeTo(julianDate(new Date("2000-01-01T12:00:00.000Z")), 2451545.0);
closeTo(localSiderealTime(new Date("2000-01-01T12:00:00.000Z"), 0), 280.46061837, 1e-5);

assert.equal(normalizeDegrees(-10), 350);
assert.equal(normalizeDegrees(370), 10);
assert.equal(normalizeSignedDegrees(190), -170);
assert.equal(normalizeSignedDegrees(-190), 170);

const date = new Date("2000-01-01T12:00:00.000Z");
const lat = 51;
const lon = 3;
const lst = localSiderealTime(date, lon);
const zenith = calculateAzAlt(date, lat, lon, lst, lat);
closeTo(zenith.altitude, 90, 1e-8);

const northHorizon = calculateAzAlt(date, lat, lon, lst + 180, 90 - lat);
closeTo(northHorizon.altitude, 0, 1e-8);

console.log("astronomy tests passed");
