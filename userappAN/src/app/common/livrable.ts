export class Livrable {
    constructor(
        public idLivrable: number,
        public title: string,
        public projectName: string,
        public format: Format,  // Enum équivalent
        public description: string,
        public completed_count: number,
        public total_count: number,
        public status: Status,  // Enum équivalent
        public due_date: Date,
        public createdAt: Date,
        public updatedAt: Date,

        // New computed fields from backend DTO
    public progressPercentage: number,
    public isOverdue: boolean,
    public isCompleted: boolean
    ) {}
}

// Définition des enums pour correspondre à l'annotation @Enumerated(EnumType.STRING)
export enum Format {
    PDF = 'PDF',
    EXCEL = 'EXCEL',
    WORD = 'WORD',
    OTHER = 'OTHER'
}

export enum Status {
    IN_PROGRESS = 'InProgress',
    COMPLETED = 'Completed',
    LATE = 'Late',
    APPROVED = 'Approved',
    REJECTED = 'Rejected'
}

