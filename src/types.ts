import { IntrospectionEnumValue } from "graphql";

export interface SimplifiedArg {
	defaultValue: any;
	description: string;
	id?: string;
	name: string;
	typeWrappers: ("NON_NULL" | "LIST")[];
}

export interface SimplifiedField<T> {
	args: Record<string, SimplifiedArg>;
	deprecationReason: string | null;
	description: string | null;
	id?: string;
	isDeprecated: boolean;
	name: string;
	relayArgs?: Record<string, SimplifiedArg>;
	relayType?: T;
	type: T;
	typeWrappers: ("NON_NULL" | "LIST")[];
}

export type SimplifiedInputField = SimplifiedArg;

export interface SimplifiedTypeBase {
	description: string;
	enumValues?: IntrospectionEnumValue[];
	inputFields?: Record<string, SimplifiedInputField>;
	isRelayType?: boolean;
	kind: "OBJECT" | "INTERFACE" | "UNION" | "ENUM" | "INPUT_OBJECT" | "SCALAR";
	name: string;
}

export type SimplifiedType = SimplifiedTypeBase & {
	derivedTypes?: string[];
	fields?: Record<string, SimplifiedField<string>>;
	interfaces?: string[];
	possibleTypes?: string[];
	parents?: string[];
};

export type SimplifiedTypeWithIDs = SimplifiedTypeBase & {
	derivedTypes?: {
		id: string;
		type: SimplifiedTypeWithIDs;
	}[];
	fields?: Record<string, SimplifiedField<SimplifiedTypeWithIDs>>;
	id: string;
	interfaces?: {
		id: string;
		type: SimplifiedTypeWithIDs;
	}[];
	possibleTypes?: {
		id: string;
		type: SimplifiedTypeWithIDs;
	}[];
	parents?: string[];
};

export interface SimplifiedIntrospection {
	mutationType: string | null;
	queryType: string;
	subscriptionType: string | null;
	types: Record<string, SimplifiedType>;
}

export interface SimplifiedIntrospectionWithIds {
	mutationType: SimplifiedTypeWithIDs | null;
	queryType: SimplifiedTypeWithIDs;
	subscriptionType: SimplifiedTypeWithIDs | null;
	types: Record<string, SimplifiedTypeWithIDs>;
}
