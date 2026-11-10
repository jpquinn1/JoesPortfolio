export const studioTools = {
  excel: { name: 'Excel', color: '#217346', logo: null },
  sheets: { name: 'Google Sheets', color: '#23834e', logo: 'google-sheets' },
  gmail: { name: 'Gmail', color: '#b84e42', logo: 'gmail' },
  slack: { name: 'Slack', color: '#72527e', logo: 'slack' },
  grafana: { name: 'Grafana', color: '#b76b22', logo: 'grafana' },
  n8n: { name: 'n8n', color: '#ff91ac', logo: 'n8n' },
} as const;

export type StudioTool = keyof typeof studioTools;
