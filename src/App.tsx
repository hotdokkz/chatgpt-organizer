import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Folder, Chat } from './types';

function App() {
  const [folders, setFolders] = useState<Folder[]>([
    {
      id: '1',
      name: 'Personal',
      parentId: null,
      subfolders: [],
      chats: [
        { id: '1', title: 'Travel Planning', lastModified: new Date() }
      ]
    }
  ]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const findFolder = (folderId: string, folderList: Folder[]): Folder | null => {
    for (const folder of folderList) {
      if (folder.id === folderId) return folder;
      const found = findFolder(folderId, folder.subfolders);
      if (found) return found;
    }
    return null;
  };

  const createFolder = (parentId: string | null) => {
    const newFolder: Folder = {
      id: generateId(),
      name: 'New Folder',
      parentId,
      subfolders: [],
      chats: []
    };

    if (!parentId) {
      setFolders([...folders, newFolder]);
    } else {
      const updateFolders = (folderList: Folder[]): Folder[] => {
        return folderList.map(folder => {
          if (folder.id === parentId) {
            return {
              ...folder,
              subfolders: [...folder.subfolders, newFolder]
            };
          }
          return {
            ...folder,
            subfolders: updateFolders(folder.subfolders)
          };
        });
      };

      setFolders(updateFolders(folders));
    }
  };

  const createChat = (folderId: string | null) => {
    const newChat: Chat = {
      id: generateId(),
      title: 'New Chat',
      lastModified: new Date()
    };

    if (!folderId) {
      // Create at root level (not implemented in this UI)
      return;
    }

    const updateFolders = (folderList: Folder[]): Folder[] => {
      return folderList.map(folder => {
        if (folder.id === folderId) {
          return {
            ...folder,
            chats: [...folder.chats, newChat]
          };
        }
        return {
          ...folder,
          subfolders: updateFolders(folder.subfolders)
        };
      });
    };

    setFolders(updateFolders(folders));
  };

  const renameFolder = (folderId: string, newName: string) => {
    const updateFolders = (folderList: Folder[]): Folder[] => {
      return folderList.map(folder => {
        if (folder.id === folderId) {
          return { ...folder, name: newName };
        }
        return {
          ...folder,
          subfolders: updateFolders(folder.subfolders)
        };
      });
    };

    setFolders(updateFolders(folders));
  };

  const renameChat = (chatId: string, newTitle: string) => {
    const updateFolders = (folderList: Folder[]): Folder[] => {
      return folderList.map(folder => {
        const chatIndex = folder.chats.findIndex(chat => chat.id === chatId);
        if (chatIndex !== -1) {
          const updatedChats = [...folder.chats];
          updatedChats[chatIndex] = { ...updatedChats[chatIndex], title: newTitle };
          return { ...folder, chats: updatedChats };
        }
        return {
          ...folder,
          subfolders: updateFolders(folder.subfolders)
        };
      });
    };

    setFolders(updateFolders(folders));
  };

  const deleteFolder = (folderId: string) => {
    const updateFolders = (folderList: Folder[]): Folder[] => {
      return folderList.filter(folder => folder.id !== folderId)
        .map(folder => ({
          ...folder,
          subfolders: updateFolders(folder.subfolders)
        }));
    };

    setFolders(updateFolders(folders));
  };

  const deleteChat = (folderId: string | null, chatId: string) => {
    if (!folderId) return;

    const updateFolders = (folderList: Folder[]): Folder[] => {
      return folderList.map(folder => {
        if (folder.id === folderId) {
          return {
            ...folder,
            chats: folder.chats.filter(chat => chat.id !== chatId)
          };
        }
        return {
          ...folder,
          subfolders: updateFolders(folder.subfolders)
        };
      });
    };

    setFolders(updateFolders(folders));
  };

  const handleDrop = (itemId: string, itemType: 'CHAT' | 'FOLDER', targetFolderId: string | null) => {
    if (itemType === 'FOLDER') {
      // Prevent dropping a folder into itself or its descendants
      const sourceFolder = findFolder(itemId, folders);
      if (!sourceFolder) return;
      
      let currentFolder = findFolder(targetFolderId!, folders);
      while (currentFolder) {
        if (currentFolder.id === itemId) return;
        currentFolder = currentFolder.parentId ? findFolder(currentFolder.parentId, folders) : null;
      }

      // Move folder
      const moveFolder = (folderList: Folder[]): Folder[] => {
        const updatedList = folderList.filter(f => f.id !== itemId);
        const movedFolder = folderList.find(f => f.id === itemId);
        
        if (movedFolder) {
          if (!targetFolderId) {
            return [...updatedList, { ...movedFolder, parentId: null }];
          }
          
          return updatedList.map(folder => {
            if (folder.id === targetFolderId) {
              return {
                ...folder,
                subfolders: [...folder.subfolders, { ...movedFolder, parentId: targetFolderId }]
              };
            }
            return {
              ...folder,
              subfolders: moveFolder(folder.subfolders)
            };
          });
        }
        
        return folderList.map(folder => ({
          ...folder,
          subfolders: moveFolder(folder.subfolders)
        }));
      };

      setFolders(moveFolder(folders));
    } else if (itemType === 'CHAT') {
      // Move chat
      const moveChat = (folderList: Folder[]): Folder[] => {
        let chatToMove: Chat | undefined;
        
        const sourceList = folderList.map(folder => {
          const chat = folder.chats.find(c => c.id === itemId);
          if (chat) {
            chatToMove = chat;
            return {
              ...folder,
              chats: folder.chats.filter(c => c.id !== chatId)
            };
          }
          return {
            ...folder,
            subfolders: moveChat(folder.subfolders)
          };
        });

        if (chatToMove) {
          return sourceList.map(folder => {
            if (folder.id === targetFolderId) {
              return {
                ...folder,
                chats: [...folder.chats, chatToMove!]
              };
            }
            return folder;
          });
        }

        return sourceList;
      };

      setFolders(moveChat(folders));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        folders={folders}
        onRenameFolder={renameFolder}
        onRenameChat={renameChat}
        onCreateFolder={createFolder}
        onCreateChat={createChat}
        onDeleteFolder={deleteFolder}
        onDeleteChat={deleteChat}
        onDrop={handleDrop}
      />
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-4">ChatGPT Organizer</h1>
          <p className="text-gray-600">
            Select a chat from the sidebar or create a new one to get started.
            You can organize your chats by:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-600">
            <li>Creating folders and subfolders</li>
            <li>Creating new chats within folders</li>
            <li>Double-click names to rename folders and chats</li>
            <li>Dragging and dropping chats between folders</li>
            <li>Dragging and dropping folders to reorganize</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;