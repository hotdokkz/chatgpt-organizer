import React from 'react';
import { MessageSquare, Trash } from 'lucide-react';
import { EditableText } from './EditableText';
import { Chat } from '../types';

interface ChatItemProps {
  chat: Chat;
  level: number;
  folderId: string;
  onRename: (chatId: string, newTitle: string) => void;
  onDelete: (folderId: string, chatId: string) => void;
  onDragStart: (e: React.DragEvent, id: string, type: 'CHAT' | 'FOLDER') => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  level,
  folderId,
  onRename,
  onDelete,
  onDragStart,
}) => {
  return (
    <div
      className="flex items-center px-2 py-1 hover:bg-gray-100 rounded cursor-pointer group"
      style={{ paddingLeft: `${level * 16}px` }}
      draggable
      onDragStart={(e) => onDragStart(e, chat.id, 'CHAT')}
    >
      <MessageSquare size={16} className="text-gray-500 flex-shrink-0" />
      <div className="ml-2 flex-grow">
        <EditableText
          value={chat.title}
          onSave={(newTitle) => onRename(chat.id, newTitle)}
          className="text-sm"
        />
      </div>
      <button
        onClick={() => onDelete(folderId, chat.id)}
        className="ml-auto hidden group-hover:block p-1 hover:bg-gray-200 rounded text-red-500"
      >
        <Trash size={14} />
      </button>
    </div>
  );
};