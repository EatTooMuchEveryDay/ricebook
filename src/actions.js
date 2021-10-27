/*
 * action types
 */
export const LOGIN = "LOGIN";


/*
 * action creator
 */
export function login(username) {
    return {type: LOGIN, username};
}

