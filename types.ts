export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  description: string; // Used for the AI prompt
}

export interface AppState {
  originalImage: string | null; // Base64 string
  generatedImage: string | null; // Base64 string
  isProcessing: boolean;
  selectedColor: ColorOption;
  error: string | null;
}

export enum ViewMode {
  UPLOAD = 'UPLOAD',
  PREVIEW = 'PREVIEW',
  COMPARE = 'COMPARE'
}
