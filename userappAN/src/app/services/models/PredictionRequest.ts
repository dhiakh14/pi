export interface PredictionRequest {
    name: string;
    description: string;
    effectif: number;
    niveau_complexity: 'low' | 'medium' | 'hard';
  }