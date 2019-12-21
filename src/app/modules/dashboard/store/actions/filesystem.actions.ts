import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export const createEntity = createAction('[Save File] File Save Requested', props<{ folder: any, id: string }>())
export const createFolder = createAction('[Create Folder] Create Folder Requested', props<{ userId: string, path: string, data: any }>())
export const uploadFile = createAction('[File Upload] Upload File to Repo', props<{ userId: string, path: string, data: any }>())
export const readEntityContents = createAction('[Get Folder Contents] Folder Contents Requested', props<{ folder: any, id: string }>())
export const saveRetrievedFolderContents = createAction('[Saved Contents] Saved Retrieved Folder Contents', props<{ contents: any }>())
export const updateFolderContents = createAction('[Update Folder Contents] Update Existing Contents', props<{ userId: string, path: string, data: any }>())
export const deleteFolderEntities = createAction('[Delete Items] Delete Items From Store', props<{ ids: string[] }>())
export const deleteFolderEntity = createAction('[Delete Item] Delete Item From Store', props<{ id: string }>())
export const updateFavoriteStatus = createAction('[Modify Item] Modify Favorite State', props<{ entity: Update<any>, userId: string }>())
export const addToFavorites = createAction('[Star Item] Add To Favorites', props<{ entity: Update<any>, userId: string }>())
export const downloadEntity = createAction('[Download Item] Download Item From Folder', props<{ path: string, name: string, userId: string }>())
export const downloadEntityCancel = createAction('[Download Item] Download Item Cancelled', props<{ id: string, path: string, name: string }>())
export const renameEntity = createAction('[Filesystem API] Rename Entity', props<{ entity: Update<any>, body: any }>())
