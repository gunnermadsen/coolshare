import { createAction, props } from '@ngrx/store';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export const fetchProfileInfoAction = createAction('[Account API] Fetch Account Info', props<{ id: string }>())
export const updateProfileAction = createAction('[Account API] Update Profile', props<{ id: string, profile: any }>())
export const updatePasswordAction = createAction('[Account API] Fetch Account Info', props<{ id: string, profile: { password: string } }>())
export const updateProfilePictureAction = createAction('[Account API] Update Picture', props<{ id: string, picture: string }>())
export const saveProfileInfoAction = createAction('[Account API] Save Account Info', props<{ profile: any }>())