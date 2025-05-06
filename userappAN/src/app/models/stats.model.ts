export interface StatsDTO {
    total: number;
    late: number;
    byStatus: { [key: string]: number };
    byMonth: { [key: string]: number };
    byProject: { [key: string]: number };
    completionRate: number;
}
