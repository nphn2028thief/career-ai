export const linkedInText = (
  linkedInUrl: string
) => `<a href="${linkedInUrl}" target="_blank" rel="noopener noreferrer">
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" width="16" alt="LinkedIn Logo"/>
        <span> ${linkedInUrl}</span>
    </a>`;

export const twitterText = (
  twitterUrl: string
) => `<a href="${twitterUrl}" target="_blank" rel="noopener noreferrer">
        <img src="https://abs.twimg.com/icons/apple-touch-icon-192x192.png" width="20" alt="Twitter Logo"/>
        <span> ${twitterUrl}</span>
    </a>`;
