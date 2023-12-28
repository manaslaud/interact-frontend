import React, { useState, useEffect, useRef } from 'react';

interface TagsComponentProps {
  user: {
    tags: string[];
  };
}

const TagsComponent: React.FC<TagsComponentProps> = ({ user }) => {
  const [showMore, setShowMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderedTags, setRenderedTags] = useState<JSX.Element[]>([]);

  useEffect(() => {
    renderTags();
  }, [user.tags]);

  const renderTags = () => {
    const container = containerRef.current;
    if (!container) return;

    const tempContainer = document.createElement('div');
    tempContainer.style.visibility = 'hidden';
    document.body.appendChild(tempContainer);

    let remainingTags = user.tags.length;
    let tagsToRender: JSX.Element[] = [];

    for (const tag of user.tags) {
      tempContainer.innerText = tag;

      if (tempContainer.scrollWidth > container.clientWidth) {
        // Overflow will occur, stop rendering and show "+{remaining number of tags} more"
        setShowMore(true);
        break;
      }

      // No overflow, render the tag
      tagsToRender.push(renderTag(tag));
      remainingTags--;
    }

    document.body.removeChild(tempContainer);

    // Update the rendered tags in the component
    setRenderedTags(tagsToRender);
  };

  const renderTag = (tag: string) => {
    return (
      <div key={tag} className="text-gray-600 flex-center px-2 py-1 text-xs border-[1px] border-gray-500 rounded-lg">
        {tag}
      </div>
    );
  };

  const renderRemainingTags = () => {
    return (
      <div className="text-gray-600 flex-center p-2 text-xs border-[1px] border-gray-500 rounded-lg">
        +{user.tags.length - renderedTags.length} more
      </div>
    );
  };

  return (
    <div className="w-full flex gap-2" ref={containerRef}>
      {renderedTags}
      {showMore && renderRemainingTags()}
    </div>
  );
};

export default TagsComponent;
