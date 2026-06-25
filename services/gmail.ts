import { getAccessToken } from './auth';

export const sendEmail = async (to: string, subject: string, messageText: string, fromName: string, fromEmail: string) => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available. Please sign in.");
  }

  // Construct RFC 2822 email
  const emailLines = [];
  emailLines.push(`To: ${to}`);
  emailLines.push(`Subject: ${subject}`);
  emailLines.push('Content-Type: text/plain; charset="UTF-8"');
  emailLines.push('');
  emailLines.push(`From Name: ${fromName}`);
  emailLines.push(`From Email: ${fromEmail}`);
  emailLines.push('');
  emailLines.push(messageText);

  const emailRaw = emailLines.join('\r\n');

  // Base64url encode
  const encodedEmail = btoa(unescape(encodeURIComponent(emailRaw)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: encodedEmail,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gmail API error: ${response.status} - ${errorBody}`);
  }

  return await response.json();
};
