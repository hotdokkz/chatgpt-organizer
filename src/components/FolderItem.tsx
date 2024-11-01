import React, { useState } from 'react';
import { Folder as FolderIcon, MessageSquare, Plus, ChevronRight, ChevronDown, Trash } from 'lucide-react';
import { EditableText } from './EditableText';
import { ChatItem } from './ChatItem';
import { Folder } from '../types';

interface FolderItemProps {
  folder: Folder;
  level: number;
  onRenameFolder: (folderId: string, newName: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
  onCreateFolder: (parentId: string | null) => void;
  onCreateChat: (folderId: string | null) => void;
  onDeleteFolder: (folderId: string) => void;
  onDeleteChat: (folderId: string | null, chatId: string) => void;
  onDrop: (itemId: string, itemType: 'CHAT' | 'FOLDER', targetFolderId: string | null) => void;
}

export const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  level,
  onRenameFolder,
  onRenameChat,
  onCreateFolder,
  onCreateChat,
  onDeleteFolder,
  onDeleteChat,
  onDrop,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent, id: string, type: 'CHAT' | 'FOLDER') => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id, type, currentFolderId: folder.id }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    onDrop(data.id, data.type, folder.id);
  };

  return (
    <div className="select-none">
      <div 
        className="flex items-center px-2 py-1 hover:bg-gray-100 rounded cursor-pointer group"
        style={{ paddingLeft: `${level * 16}px` }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        draggable
        onDragStart={(e) => handleDragStart(e, folder.id, 'FOLDER')}
      >
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <FolderIcon size={16} className="ml-1 text-gray-500" />
        </div>
        
        <div className="ml-2 flex-grow">
          <EditableText
            value={folder.name}
            onSave={(newName) => onRenameFolder(folder.id, newName)}
            className="text-sm"
          />
        </div>
        
        <div className="ml-auto hidden group-hover:flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateChat(folder.id);
            }}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <MessageSquare size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateFolder(folder.id);
            }}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteFolder(folder.id);
            }}
            className="p-1 hover:bg-gray-200 rounded text-red-500"
          >
            <Trash size={14} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div>
          {folder.chats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              level={level + 1}
              folderId={folder.id}
              onRename={onRenameChat}
              onDelete={onDeleteChat}
              onDragStart={handleDragStart}
            />
          ))}
          {folder.subfolders.map((subfolder) => (
            <FolderItem
              key={subfolder.id}
              folder={subfolder}
              level={level + 1}
              onRenameFolder={onRenameFolder}
              onRenameChat={onRenameChat}
              onCreateFolder={onCreateFolder}
              onCreateChat={onCreateChat}
              onDeleteFolder={onDeleteFolder}
              onDeleteChat={onDeleteChat}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
};