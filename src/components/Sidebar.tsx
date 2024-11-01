import React from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import { FolderItem } from './FolderItem';
import { Folder } from '../types';

interface SidebarProps {
  folders: Folder[];
  onRenameFolder: (folderId: string, newName: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
  onCreateFolder: (parentId: string | null) => void;
  onCreateChat: (folderId: string | null) => void;
  onDeleteFolder: (folderId: string) => void;
  onDeleteChat: (folderId: string | null, chatId: string) => void;
  onDrop: (itemId: string, itemType: 'CHAT' | 'FOLDER', targetFolderId: string | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  folders,
  onRenameFolder,
  onRenameChat,
  onCreateFolder,
  onCreateChat,
  onDeleteFolder,
  onDeleteChat,
  onDrop,
}) => {
  return (
    <div className="w-64 bg-white border-r h-screen p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Chats</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => onCreateChat(null)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <MessageSquare size={16} />
          </button>
          <button
            onClick={() => onCreateFolder(null)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      
      <div className="space-y-1">
        {folders.map((folder) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            level={0}
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
    </div>
  );
};