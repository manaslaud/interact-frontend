import React, { useState, useRef } from 'react';

function CustomEditor() {
  const [content, setContent] = useState<string>('');
  const [selection, setSelection] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = event.target.value;
    setContent(newContent);
  };

  const applyFormatting = (tag: string) => {
    const selectedText = content.slice(selection.start, selection.end);
    const tagStart = `<${tag}>`;
    const tagEnd = `</${tag}>`;
    const updatedText =
      content.slice(0, selection.start) +
      (selectedText.includes(tagStart)
        ? selectedText.replace(tagStart, '').replace(tagEnd, '')
        : `${tagStart}${selectedText}${tagEnd}`) +
      content.slice(selection.end);

    setContent(updatedText);
    restoreFocus();
  };

  const handleTextSelection = (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement;
    setSelection({
      start: target.selectionStart,
      end: target.selectionEnd,
    });
  };

  const restoreFocus = () => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };

  return (
    <div className="flex p-4">
      <div className="w-1/2 pr-2">
        <div className="mb-2">
          <button
            className={`px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 ${
              content.slice(selection.start, selection.end).includes('<strong>') ? 'bg-gray-300' : ''
            }`}
            onClick={() => applyFormatting('strong')}
          >
            Bold
          </button>
          <button
            className={`px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2 ${
              content.slice(selection.start, selection.end).includes('<u>') ? 'bg-gray-300' : ''
            }`}
            onClick={() => applyFormatting('u')}
          >
            Underline
          </button>
          <button
            className={`px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2 ${
              content.slice(selection.start, selection.end).includes('<h1>') ? 'bg-gray-300' : ''
            }`}
            onClick={() => applyFormatting('h1')}
          >
            H1
          </button>
          <button
            className={`px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2 ${
              content.slice(selection.start, selection.end).includes('<h2>') ? 'bg-gray-300' : ''
            }`}
            onClick={() => applyFormatting('h2')}
          >
            H2
          </button>
          <button
            className={`px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2 ${
              content.slice(selection.start, selection.end).includes('<h3>') ? 'bg-gray-300' : ''
            }`}
            onClick={() => applyFormatting('h3')}
          >
            H3
          </button>
        </div>
        <textarea
          ref={textAreaRef}
          value={content}
          onChange={handleContentChange}
          onSelect={handleTextSelection}
          className="w-full h-48 border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="w-1/2 pl-2 border border-gray-300 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Preview</h2>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}

export default CustomEditor;
