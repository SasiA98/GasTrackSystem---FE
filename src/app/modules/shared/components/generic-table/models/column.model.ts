export interface Column {
  title: string;
  attributeName: string;
  accent?: boolean;
  editable?: boolean;
  pipeArgs?: string | ((args: any) => string);
  icon?: string;
  isEnabled?: boolean;
  number?: boolean;
  verifiedHours?: boolean;
  leaveicon?: boolean;
}
