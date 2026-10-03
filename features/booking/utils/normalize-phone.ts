export function normalizePhone(
  value: string,
): string {
  let phone = value
    .trim()
    .replace(/[^\d+]/g, "");

  // 00216XXXXXXXX → +216XXXXXXXX
  if (phone.startsWith("00216")) {
    phone = `+216${phone.slice(5)}`;
  }

  // 216XXXXXXXX → +216XXXXXXXX
  if (
    phone.startsWith("216") &&
    !phone.startsWith("+216")
  ) {
    phone = `+${phone}`;
  }

  // XXXXXXXX → +216XXXXXXXX
  if (/^\d{8}$/.test(phone)) {
    phone = `+216${phone}`;
  }

  return phone;
}