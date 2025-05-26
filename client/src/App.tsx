import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import {
    useDojoSDK,
    useEntityId,
    useEntityQuery,
    useModel,
} from "@dojoengine/sdk/react";

import { useSystemCalls } from "./useSystemCalls.ts";
import { ModelsMapping } from "./typescript/models.gen.ts";
import { useAccount } from "@starknet-react/core";

import { addAddressPadding } from "starknet";
import { WalletAccount } from "./wallet-account.tsx";
import { HistoricalEvents } from "./historical-events.tsx";
import { Events } from "./events.tsx";

import { useRef, useState } from 'react';
import Phaser from 'phaser';
import { PhaserGame } from './PhaserGame';

function App() {
    const { useDojoStore, client } = useDojoSDK();
    const { account } = useAccount();
    const entities = useDojoStore((state) => state.entities);
    const [canMoveSprite, setCanMoveSprite] = useState(true);
    const phaserRef = useRef();

    const { spawn, give_heart } = useSystemCalls();
    const entityId = useEntityId(account?.address ?? "0");
    const capys = useModel(entityId as string, ModelsMapping.Capy);

    const changeScene = () => {
        const scene = phaserRef.current?.scene;
        if (scene) scene.changeScene();
    };

    const currentScene = (scene) => {
        setCanMoveSprite(scene.scene.key !== 'MainMenu');
    };

    useEntityQuery(
        new ToriiQueryBuilder()
            .withClause(
                KeysClause(
                    [ModelsMapping.Capy],
                    [
                        account?.address
                            ? addAddressPadding(account.address)
                            : undefined,
                    ],
                    "FixedLen"
                ).build()
            )
            .includeHashedKeys()
    );

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            {/* Header */}
            <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
                <div className="text-lg font-bold">CapySpace</div>
                <div className="flex items-center gap-4">
                    <WalletAccount />
                    <span className="text-sm">
                        Account: {account?.address || "No account"}
                    </span>
                </div>
            </header>

            {/* Main layout */}
            <main className="flex-1 flex gap-4 p-4 overflow-hidden">
                {/* Game Canvas - ahora ocupa 4/5 del ancho */}
                <div className="w-4/5 h-full bg-black rounded-lg shadow-lg overflow-hidden">
                    <PhaserGame ref={phaserRef} currentActiveScene={currentScene}/>
                </div>

                {/* Control Panel - ocupa 1/5 */}
                <div className="w-1/5 bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <button
                            className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-lg font-semibold shadow"
                            onClick={async () => await spawn()}
                        >
                            Spawn
                        </button>
                        <button
                            className="w-full py-2 bg-pink-600 hover:bg-pink-500 rounded-lg text-lg font-semibold shadow"
                            onClick={async () => await give_heart()}
                        >
                            ❤️ Give Heart
                        </button>
                    </div>
                    <div className="text-center text-white mt-4">
                        <div className="font-bold">Hearts:</div>
                        <div className="text-xl">{capys ? capys.hearts : "Need to Spawn"}</div>
                    </div>
                </div>
            </main>

        </div>
    );
}

export default App;
