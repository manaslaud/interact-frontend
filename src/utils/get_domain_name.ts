const getDomainName = (link: string): string => {
  try {
    return new URL(link).hostname
      .replace('.com', '')
      .replace('.co', '')
      .replace('.in', '')
      .replace('.org', '')
      .replace('.net', '')
      .replace('www.', '');
  } catch {
    return '';
  }
};

export default getDomainName;
