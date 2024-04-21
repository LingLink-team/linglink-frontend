export const userData = [
  {
    id: 1,
    avatar: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(9).webp",
    messages: [
      {
        id: 1,
        avatar: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(9).webp",
        name: "Jane Doe",
        message: "Hey, Jakob",
      },
      {
        id: 2,
        avatar: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(9).webp",
        name: "Jakob Hoeg",
        message: "Hey!",
      },
      {
        id: 3,
        avatar: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(9).webp",
        name: "Jane Doe",
        message: "How are you?",
      },
      {
        id: 4,
        avatar: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(9).webp",
        name: "Jakob Hoeg",
        message: "I am good, you?",
      },
      {
        id: 5,
        avatar: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(9).webp",
        name: "Jane Doe",
        message: "I am good too!",
      },
      {
        id: 6,
        avatar: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(9).webp",
        name: "Jakob Hoeg",
        message: "That is good to hear!",
      },
      {
        id: 7,
        avatar: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(9).webp",
        name: "Jane Doe",
        message: "How has your day been so far?",
      },
      {
        id: 8,
        avatar: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(9).webp",
        name: "Jakob Hoeg",
        message:
          "It has been good. I went for a run this morning and then had a nice breakfast. How about you?",
      },
      {
        id: 9,
        avatar: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(9).webp",
        name: "Jane Doe",
        message: "I had a relaxing day. Just catching up on some reading.",
      },
    ],
    name: "Jane Doe",
  },
  {
    id: 2,
    avatar: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(9).webp",
    name: "John Doe",
  },
  {
    id: 3,
    avatar: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(9).webp",
    name: "Elizabeth Smith",
  },
  {
    id: 4,
    avatar: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(9).webp",
    name: "John Smith",
  },
];

export type UserData = (typeof userData)[number];

export const loggedInUserData = {
  id: 5,
  avatar: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(9).webp",
  name: "Jakob Hoeg",
};

export type LoggedInUserData = typeof loggedInUserData;

export interface Message {
  content: string,
  imgs_url: string[],
  from: User,
  chatRoomId: string
}

export const roomsData = [
    {
        "chatRoomId": "2",
        "name": "demo",
        "participant": [
            {
                "_id": "65a5496ea9d202175a3af0af",
                "email": "lamdienchinh@gmail.com",
                "name": "Lâm Điền Chinh",
                "avatar": "https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-1/273268489_1552058565180288_1597777769355305996_n.jpg?stp=dst-jpg_s320x320&_nc_cat=103&ccb=1-7&_nc_sid=5740b7&_nc_eui2=AeH9TzAa-pjkUA3gPWiX3pSZ7iNw4ui7nPzuI3Di6Luc_Pgmj6PJmT1X7PBBL3JZmdqTiwj-DucoYhIi_U9ioHhA&_nc_ohc=EsUBohjBRkkAX_Ob_wG&_nc_ht=scontent.fsgn5-12.fna&oh=00_AfCrXWl1_8cj7pZR8r_O-VzraZPPYevzHoM-TH9F2MzdaQ&oe=65AD5066",
            },
            {
                "_id": "65e749feb24791111125d619",
                "email": "nguyen.lenguyennek@hcmut.edu.vn",
                "name": "NGUYÊN LÊ TRÍ",
                "avatar": "https://lh3.googleusercontent.com/a/ACg8ocLes_8hBrGmfSeOwh_QTh9xY2jP5_8srq-2A4zXsjmNu1E=s96-c",
            }
        ],
        "friends": {
            "_id": "65e749feb24791111125d619",
            "email": "nguyen.lenguyennek@hcmut.edu.vn",
            "name": "NGUYÊN LÊ TRÍ",
            "avatar": "https://lh3.googleusercontent.com/a/ACg8ocLes_8hBrGmfSeOwh_QTh9xY2jP5_8srq-2A4zXsjmNu1E=s96-c",
        }
    }
]

export interface User {
  _id: string,
  email: string,
  name: string,
  avatar: string,
}

export interface Room {
  chatRoomId: string,
  name: string,
  participant: User[],
  friends: User
}

export interface Request {
  _id: string,
  sender: User,
  receiver: User,
  status: string
}
