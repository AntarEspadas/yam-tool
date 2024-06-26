import type { AreaDetails } from '$lib/types';

export class AreaDetailsService {
	private static readonly KEY = 'areaDetails';

	public getAreaDetails() {
		const serializedAreaDetails = localStorage.getItem(AreaDetailsService.KEY) as string;
		return (JSON.parse(serializedAreaDetails) ?? {}) as Record<string, AreaDetails>;
	}

	public saveAreaDetails(areaDetails: Record<string, AreaDetails>) {
		const serializedAreaDetails = JSON.stringify(areaDetails);
		localStorage.setItem(AreaDetailsService.KEY, serializedAreaDetails);
	}
}

export const areaDetailsService = new AreaDetailsService();
