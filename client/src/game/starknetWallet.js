import { Provider, constants } from 'starknet';
import { getStarknet } from 'get-starknet';

export class StarknetWallet {
    constructor() {
        this.wallet = null;
        this.provider = new Provider({
            sequencer: {
                network: constants.NetworkName.SN_MAIN
            }
        });
    }

    async connect() {
        try {
            // Intenta conectar con la extensión de wallet
            const starknet = getStarknet();

            // Verifica si la wallet está instalada
            if (!starknet) {
                console.error('Please install a StarkNet wallet extension');
                return false;
            }

            // Solicita conexión
            await starknet.enable();

            if (starknet.isConnected) {
                this.wallet = starknet;
                console.log('Connected to wallet:', starknet.account.address);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Wallet connection error:', error);
            return false;
        }
    }

    async disconnect() {
        // En StarkNet, no hay un método directo de desconexión,
        // pero puedes limpiar el estado
        this.wallet = null;
        console.log('Wallet disconnected');
    }

    isConnected() {
        return this.wallet !== null && this.wallet.isConnected;
    }

    getAccount() {
        return this.wallet?.account;
    }

    getAddress() {
        return this.wallet?.account?.address;
    }
}
