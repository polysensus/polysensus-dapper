export type ZeroDevConfig = {
	projectId: string;
	/** The RPC endpoint for the ERC 4337 bundler */
	bundlerRPC: string;

	/** The RPC endpoint for the ERC 4337 paymaster */
	paymasterRPC: string;
};
