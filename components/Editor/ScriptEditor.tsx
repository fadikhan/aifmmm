'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useCallback } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '../UI/Button'

interface ScriptEditorProps {
  content: string
  onChange: (content: string) => void
  onAIReWrite?: () => void
  placeholder?: string
}

export function ScriptEditor({
  content,
  onChange,
  onAIReWrite,
  placeholder = 'Start writing your scene...',
}: ScriptEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const handleReWrite = useCallback(() => {
    if (onAIReWrite && editor) {
      const currentContent = editor.getText()
      onAIReWrite()
    }
  }, [editor, onAIReWrite])

  if (!editor) {
    return null
  }

  return (
    <div className="border border-white/10 rounded-lg bg-panel/50 backdrop-blur-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`px-3 py-1 text-sm rounded ${
              editor.isActive('bold')
                ? 'bg-accent/20 text-accent'
                : 'hover:bg-white/10 text-white/70'
            }`}
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`px-3 py-1 text-sm rounded ${
              editor.isActive('italic')
                ? 'bg-accent/20 text-accent'
                : 'hover:bg-white/10 text-white/70'
            }`}
          >
            Italic
          </button>
        </div>

        {onAIReWrite && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReWrite}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Rewrite with AI
          </Button>
        )}
      </div>

      {/* Editor */}
      <div className="min-h-[300px] max-h-[600px] overflow-y-auto bg-transparent">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

