import Link from 'next/link';

const renderContentWithLinks = (caption: string) => {
  const lines = caption.split('\n');

  return lines.map((line, lineIndex) => {
    const words = line.split(/\s+/);

    return (
      <div key={lineIndex}>
        {words.map((word, wordIndex) => {
          // Check if the word is a link
          if (word.startsWith('http://') || word.startsWith('https://')) {
            return (
              <a
                key={wordIndex}
                href={word}
                className="underline underline-offset-2 hover:text-primary_text transition-ease-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                {word}{' '}
              </a>
            );
          }

          // Check if the word is a tag
          if (word.startsWith('#')) {
            return (
              <Link
                key={wordIndex}
                href={`/explore?search=${word.replace('#', '')}`}
                className="font-medium hover:text-primary_text transition-ease-200"
                target="_blank"
              >
                {word}{' '}
              </Link>
            );
          }

          return <span key={wordIndex}>{word} </span>; // Render regular text
        })}
      </div>
    );
  });
};

export default renderContentWithLinks;
