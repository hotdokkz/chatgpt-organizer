export interface Chat {
  id: string;
  title: string;
  lastModified: Date;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  subfolders: Folder[];
  chats: Chat[];
}

export type DragItem = {
  id: string;
  type: 'CHAT' | 'FOLDER';
  currentFolderId: string | null;
}