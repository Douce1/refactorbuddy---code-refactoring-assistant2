
export interface RefactorConcept {
  title: string;
  description: string;
}

export interface RefactorResult {
  originalCode: string;
  refactoredCode: string;
  reasons: string[];
  concepts: RefactorConcept[];
  summary: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type SupportedLanguage = 
  | 'Auto-detect' 
  | 'JavaScript' 
  | 'TypeScript' 
  | 'Python' 
  | 'Java' 
  | 'C++' 
  | 'Go' 
  | 'Rust' 
  | 'HTML/CSS';
