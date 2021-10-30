/*
 * action types
 */
// export const USER_LOGGED_IN = "USER_LOGGED_IN";
export const SET_USERNAME = "SET_USERNAME";


/*
 * action creator
 */

export function setUsername(username) {
    return { type: SET_USERNAME, username };
}

