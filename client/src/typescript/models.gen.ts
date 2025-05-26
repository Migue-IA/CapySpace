import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { CairoCustomEnum, BigNumberish } from 'starknet';

// Type definition for `dojo_starter::models::Capy` struct
export interface Capy {
	player: string;
	hearts: BigNumberish;
	last_given_heart: BigNumberish;
}

// Type definition for `dojo_starter::models::CapyValue` struct
export interface CapyValue {
	hearts: BigNumberish;
	last_given_heart: BigNumberish;
}

// Type definition for `dojo_starter::models::Game` struct
export interface Game {
	player: string;
	start_time: BigNumberish;
	gun_type: GunTypeEnum;
	gained: BigNumberish;
	kills: BigNumberish;
	level: BigNumberish;
}

// Type definition for `dojo_starter::models::GameValue` struct
export interface GameValue {
	gun_type: GunTypeEnum;
	gained: BigNumberish;
	kills: BigNumberish;
	level: BigNumberish;
}

// Type definition for `dojo_starter::models::Gun` struct
export interface Gun {
	player: string;
	gun_type: GunTypeEnum;
	damage_level: BigNumberish;
	base_damage: BigNumberish;
}

// Type definition for `dojo_starter::models::GunValue` struct
export interface GunValue {
	gun_type: GunTypeEnum;
	damage_level: BigNumberish;
	base_damage: BigNumberish;
}

// Type definition for `dojo_starter::systems::actions::actions::Loved` struct
export interface Loved {
	player: string;
	h: BigNumberish;
}

// Type definition for `dojo_starter::systems::actions::actions::LovedValue` struct
export interface LovedValue {
	h: BigNumberish;
}

// Type definition for `dojo_starter::models::GunType` enum
export const gunType = [
	'LaserGun',
	'LaserShotgun',
	'None',
] as const;
export type GunType = { [key in typeof gunType[number]]: string };
export type GunTypeEnum = CairoCustomEnum;

export interface SchemaType extends ISchemaType {
	dojo_starter: {
		Capy: Capy,
		CapyValue: CapyValue,
		Game: Game,
		GameValue: GameValue,
		Gun: Gun,
		GunValue: GunValue,
		Loved: Loved,
		LovedValue: LovedValue,
	},
}
export const schema: SchemaType = {
	dojo_starter: {
		Capy: {
			player: "",
			hearts: 0,
			last_given_heart: 0,
		},
		CapyValue: {
			hearts: 0,
			last_given_heart: 0,
		},
		Game: {
			player: "",
			start_time: 0,
		gun_type: new CairoCustomEnum({ 
					LaserGun: "",
				LaserShotgun: undefined,
				None: undefined, }),
			gained: 0,
			kills: 0,
			level: 0,
		},
		GameValue: {
		gun_type: new CairoCustomEnum({ 
					LaserGun: "",
				LaserShotgun: undefined,
				None: undefined, }),
			gained: 0,
			kills: 0,
			level: 0,
		},
		Gun: {
			player: "",
		gun_type: new CairoCustomEnum({ 
					LaserGun: "",
				LaserShotgun: undefined,
				None: undefined, }),
			damage_level: 0,
			base_damage: 0,
		},
		GunValue: {
		gun_type: new CairoCustomEnum({ 
					LaserGun: "",
				LaserShotgun: undefined,
				None: undefined, }),
			damage_level: 0,
			base_damage: 0,
		},
		Loved: {
			player: "",
			h: 0,
		},
		LovedValue: {
			h: 0,
		},
	},
};
export enum ModelsMapping {
	Capy = 'dojo_starter-Capy',
	CapyValue = 'dojo_starter-CapyValue',
	Game = 'dojo_starter-Game',
	GameValue = 'dojo_starter-GameValue',
	Gun = 'dojo_starter-Gun',
	GunType = 'dojo_starter-GunType',
	GunValue = 'dojo_starter-GunValue',
	Loved = 'dojo_starter-Loved',
	LovedValue = 'dojo_starter-LovedValue',
}