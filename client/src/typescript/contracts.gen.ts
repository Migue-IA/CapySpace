import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum, ByteArray } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const build_actions_giveHeart_calldata = (time: BigNumberish): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "give_heart",
			calldata: [time],
		};
	};

	const actions_giveHeart = async (snAccount: Account | AccountInterface, time: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_giveHeart_calldata(time),
				"dojo_starter",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_spawn_calldata = (): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "spawn",
			calldata: [],
		};
	};

	const actions_spawn = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_spawn_calldata(),
				"dojo_starter",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		actions: {
			giveHeart: actions_giveHeart,
			buildGiveHeartCalldata: build_actions_giveHeart_calldata,
			spawn: actions_spawn,
			buildSpawnCalldata: build_actions_spawn_calldata,
		},
	};
}