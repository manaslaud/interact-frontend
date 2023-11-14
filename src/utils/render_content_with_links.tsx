import Link from 'next/link';

const renderContentWithLinks = (caption: string) => {
  const words = caption.split(/\s+/);

  return words.map((word, index) => {
    // Check if the word is a link (simple check for demonstration purposes)
    if (word.startsWith('http://') || word.startsWith('https://')) {
      return (
        <a
          key={index}
          href={word}
          className="underline underline-offset-2 hover:text-primary_text transition-ease-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          {word} {/* Render the link */}
        </a>
      );
    }

    // Check if the word has a new line character at the beginning
    const isNewLineLink = index === 0 && /\n/.test(word);
    if (isNewLineLink) {
      // If it's a new line with a link, render the link on a new line
      return (
        <>
          <br />
          <a
            href={word}
            className="underline underline-offset-2 hover:text-primary_text transition-ease-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            {word}
          </a>
        </>
      );
    }

    // Check if the word is a tag
    if (word.startsWith('#')) {
      return (
        <Link
          key={index}
          href={`/explore?search=${word.replace('#', '')}`}
          className="font-medium hover:text-primary_text transition-ease-200"
          target="_blank"
        >
          {word} {/* Render the link */}
        </Link>
      );
    }

    return <span key={index}>{word} </span>; // Render regular text
  });
};

export default renderContentWithLinks;
