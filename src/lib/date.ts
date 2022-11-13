export function spanfmt(from: Date, to: Date, locale?: Intl.LocalesArgument): string {
	const fromArg: Intl.DateTimeFormatOptions = {
		day: "numeric"
	};
	const toArg: Intl.DateTimeFormatOptions = {
		day: "numeric",
		month: "short",
		year: "numeric"
	};

	if (from.getMonth() !== to.getMonth()) {
		fromArg.month = "short";
	}

	if (from.getFullYear() !== to.getFullYear()) {
		fromArg.year = "numeric";
	}

	return `${from.toLocaleString(locale, fromArg)}–${to.toLocaleString(locale, toArg)}`;
}

export function monthSpanFmt(from: Date, to: Date, locale?: Intl.LocalesArgument): string {
	const fromArg: Intl.DateTimeFormatOptions = {};
	const toArg: Intl.DateTimeFormatOptions = {
		month: "long",
		year: "numeric"
	};

	if (from.getMonth() !== to.getMonth()) {
		fromArg.month = "short";
		toArg.month = "short";
	}

	if (from.getFullYear() !== to.getFullYear()) {
		fromArg.year = "numeric";
	}

	let out = "";
	if (Object.keys(fromArg).length > 0) {
		out += `${from.toLocaleString(locale, fromArg)}–`;
	}
	out += `${to.toLocaleString(locale, toArg)}`;

	return out;
}
