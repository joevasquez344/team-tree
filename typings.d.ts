export interface User {
    id: string,
    avatar: string,
    clockedIn: boolean,
    createdAt: string,
    email: string,
    name: string,
    onlineHistory: array,
    onlineStatus: string,
    username: string,
}
export interface Team {
    id: string,
    name: string,
    creator: string
}

export type TweetBody = {
    text: string,
    username: string,
    profileImg: string,
    image?: string,
    likes?: array
}

export type CommentBody = {
    comment: string,
    tweetId: string,
    username: string,
    profileImg: string
}

export interface Comment extends CommentBody {
    _createdAt: string,
    _id: string,
    _rev: string,
    _type: 'comment',
    _updatedAt: string,
    tweet: {
        _ref: string,
        _type: 'reference'
    }
}