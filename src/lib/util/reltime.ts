export default function reltime(ms: number, rtf: Intl.RelativeTimeFormat): string {
	const d = Math.abs(ms);

	if (d < 60 * 1000) {
		return rtf.format(Math.round(ms / 1000), "second");
	}

	if (d < 60 * 60 * 1000) {
		return rtf.format(Math.round(ms / (60 * 1000)), "minute");
	}

	if (d < 24 * 60 * 60 * 1000) {
		return rtf.format(Math.round(ms / (60 * 60 * 1000)), "hour");
	}

	if (d < 7 * 24 * 60 * 60 * 1000) {
		return rtf.format(Math.round(ms / (24 * 60 * 60 * 1000)), "day");
	}

	if (d < 30 * 24 * 60 * 60 * 1000) {
		return rtf.format(Math.round(ms / (7 * 24 * 60 * 60 * 1000)), "week");
	}

	if (d < 365 * 24 * 60 * 60 * 1000) {
		return rtf.format(Math.round(ms / (30 * 24 * 60 * 60 * 1000)), "month");
	}

	return rtf.format(Math.round(ms / (365 * 24 * 60 * 60 * 1000)), "year");
}
