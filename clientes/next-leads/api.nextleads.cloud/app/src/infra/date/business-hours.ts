export function getSaoPauloDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);

  return {
    weekday: parts.find((p) => p.type === 'weekday')?.value,
    hour: Number(parts.find((p) => p.type === 'hour')?.value || 0),
    minute: Number(parts.find((p) => p.type === 'minute')?.value || 0),
  };
}

export function isBusinessHours(date = new Date()) {
  if (process.env.IGNORE_BUSINESS_HOURS === 'true') return true;

  const { weekday, hour } = getSaoPauloDateParts(date);
  const businessDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  if (!weekday || !businessDays.includes(weekday)) return false;

  return hour >= 8 && hour < 18;
}
