export interface Category {
    id: string,
    name: string
}

export interface Attachment {
    data: string,
    filename: string,
    filesize: string,
    id: string,
    _tid?: string
}

export interface Message {
    attachments: Attachment[],
    content: string,
    createdTimestamp: number,
    editedTimestamp: number | null,
    id: string,
    pinned: boolean,
    system: boolean,
    user: string
}

export interface Channel {
    calculated_position: number,
    position: number,
    guild: string,
    name: string,
    parentID: string,
    topic?: string,
    messages: Message[]
}

export interface User {
    avatar: string,
    avatar_displayable: string,
    bot: boolean,
    discriminator: string,
    display_hex_colour: string,
    display_name: string,
    id: string,
    username: string,
    _tid?: string
}

export interface Archive {
    categories: Category[],
    channels: Channel[],
    users: User[]
}