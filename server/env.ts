/**
 * Store the environment
 */
let _env: any = {};

/**
 * Use Node environment variables by default if available
 */
if (process && process.env) {
	_env = process.env;
}

/**
 * Parse a boolean value
 */
function parseBool(value: string): boolean {
	if (typeof value == "boolean" || typeof value == "number") {
		return Boolean(value);
	}
	value = value.toLowerCase();
	return value == 'y' || value == '1' || value == "yes" || value == "true";
}

/**
 * Get a string value from the environment
 */
export function env(key: string, defaultValue?: string): string {
	return (key in _env) ? _env[key] : defaultValue;
}

export namespace env {
	/**
	 * Get a boolean value from the environment
	 */
	export function bool(key: string, defaultValue?: boolean): boolean {
		return (key in _env) ? parseBool(_env[key]) : defaultValue;
	}

	/**
	 * Get a float value from the environment
	 */
	export function float(key: string, defaultValue?: number): number {
		return (key in _env) ? parseFloat(_env[key]) : defaultValue;
	}

	/**
	 * Get an integer from the environment
	 */
	export function int(key: string, defaultValue?: number): number {
		return (key in _env) ? parseInt(_env[key]) : defaultValue;
	}

	/**
	 * Store a value in the environment
	 */
	export function store<T>(key: string, value: T) {
		_env[key] = value;
	}

	/**
	 * Use the given object as the environment
	 */
	export function use(env: object) {
		_env = env;
	}
}
