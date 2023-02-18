/* eslint-disable import/no-duplicates */
/* eslint-disable no-console */
// import { loadEnv, type ConfigEnv, type Plugin, type UserConfig } from 'vite';
import { type Plugin, loadEnv } from 'vite';
import type { ConfigEnv, UserConfig } from 'vite';

import type { ZodIssue, ZodTypeAny } from 'zod';

export interface PluginParameters {
	envLocation?: string;
	safeParse?: boolean;
	envPrefix?: string;
	customKeyTransformFunction?: (variables: Record<string, string>) => Record<string, string>;
	schema: ZodTypeAny;
}

const printErrorMessages = (errors: ZodIssue[]): string =>
	errors.reduce((str, error) => `${str}• ${error.message}\n `, '');

const validate = (config: UserConfig, env: ConfigEnv, options: PluginParameters) => {
	const envDirectory = options.envLocation ? options.envLocation : './';
	const variables = loadEnv(env.mode, envDirectory, config.envPrefix);
	const envPrefix = options.envPrefix ? options.envPrefix.toLowerCase() : 'VITE';
	const transformedVariables = options.customKeyTransformFunction
		? options.customKeyTransformFunction(variables)
		: Object.fromEntries(Object.entries(variables).map(([key, val]) => [key.replace(`${envPrefix}_`, ''), val]));
	const result = options.schema.safeParse(transformedVariables);
	if (!result.success) {
		console.log('\x1b[41m', 'ERROR', '\x1b[0m', '\x1b[31m', 'These environment variables were not valid:', '\x1b[0m');
		console.log('\x1b[1m', printErrorMessages(result.error.issues), '\x1b[0m');
		if (!options.safeParse) process.exit(9);
	}
};

export const validateEnvironment = (options: PluginParameters): Plugin => ({
	name: 'vite-plugin-zod-env-validate',
	config: (config, env) => validate(config, env, options),
});

export default validateEnvironment;
