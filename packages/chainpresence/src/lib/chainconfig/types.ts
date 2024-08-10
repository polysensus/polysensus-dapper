/**
 * Identifies a known chain configuration and
 * provides application specific access configuration
 */
export interface ChainAccessConfig {
	/** The chain id as a number */
	id: number;

	/** The established name for the chain */
	name: string;

	/** The RPC endpoint for the ERC 4337 bundler */
	bundlerRPC: string | undefined;

	/** The RPC endpoint for the ERC 4337 paymaster */
	paymasterRPC: string | undefined;
}
