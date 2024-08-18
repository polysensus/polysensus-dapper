export type DapperInfraConfig = {
	serviceName: string;
	chainConfigs: string[];
};

// ChainInfraConfig should be intersected with the specific infra type (web3authn etc)
export type ChainInfraConfig = {
	dapper: DapperInfraConfig;
};
