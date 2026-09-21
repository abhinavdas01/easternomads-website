export type Inquiry = { name: string; email: string; company: string; interest: string; message: string };
export const contactEmail = 'services@easternomads.com';
export function inquiryText(inquiry: Inquiry) {
  return `Name: ${inquiry.name.trim()}\nEmail: ${inquiry.email.trim()}\nCompany: ${inquiry.company.trim() || 'Not specified'}\nInterest: ${inquiry.interest}\n\n${inquiry.message.trim()}`;
}
export function mailtoInquiry(inquiry: Inquiry) {
  return `mailto:${contactEmail}?subject=${encodeURIComponent(`Project inquiry — ${inquiry.interest}`)}&body=${encodeURIComponent(inquiryText(inquiry))}`;
}
export function httpsDestination(value: string | undefined): string {
  try { const url = new URL(value || ''); return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''; } catch { return ''; }
}
export async function sendInquiry(endpoint: string, inquiry: Inquiry, signal: AbortSignal) {
  if (!httpsDestination(endpoint)) throw new Error('A valid contact endpoint is required.');
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(inquiry), signal, credentials: 'omit' });
  if (!response.ok) throw new Error('The contact service could not accept this inquiry.');
}

export const contactEndpoint = httpsDestination(import.meta.env.VITE_CONTACT_ENDPOINT);
export const schedulingUrl = httpsDestination(import.meta.env.VITE_SCHEDULING_URL);
