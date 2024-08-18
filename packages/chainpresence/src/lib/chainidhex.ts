export function chainIdToHex(id: number): string {
	return '0x' + id.toString(16);
}

export function chainIdFromHex(hexId: string): number {
	const origHexId: string = hexId;
	if (hexId?.startsWith('0x')) hexId = hexId.slice(2);
	if (hexId === '') hexId = '0';
	const id = parseInt(hexId, 16);
	if (isNaN(id)) throw new Error(`invalid hex chainId: ${origHexId}`);
	return id;
}
