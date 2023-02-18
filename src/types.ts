import type { ZodTypeAny } from 'zod';

export interface PluginParameters {
	envLocation?: string;
	safeParse?: boolean;
	envPrefix?: string;
	customKeyTransformFunction?: (variables: Record<string, string>) => Record<string, string>;
	schema: ZodTypeAny;
}
