import React from "react";
import { ScrollView, YStack } from "tamagui";
import { MessageItem, MessageItemData } from "./MessageItem";

const MOCK_MESSAGES: MessageItemData[] = [
  {
    id: 1,
    type: "squad",
    name: "Squad Randonnée Mont-Blanc",
    message:
      "Vous : Ça a l'air génial Marcus ! Je ramène des cookies à l'avoine pour accompagner le café. Quelqu'un a besoin d'être récupéré à la gare ?",
    time: "12:45 PM",
    unreadCount: 3,
    online: false,
    archived: false,
    avatarUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&q=80",
  },
  {
    id: 2,
    type: "individual",
    name: "Emma L.",
    message: "J’ai reservé l’hôtel pour ...",
    time: "2h ",
    unreadCount: 0,
    online: true,
    archived: false,
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  {
    id: 3,
    type: "squad",
    name: "Sommet Annecy '24",
    message: "Alex: Quelqu’un aurait un sac ...",
    time: "Hier",
    unreadCount: 0,
    online: false,
    archived: false,
    avatarUrl:
      "https://images.unsplash.com/photo-1517025807490-50d4dff1f26a?w=100&q=80",
  },
  {
    id: 4,
    type: "individual",
    name: "Sophie T.",
    message: "Je cherche pour prendre un café ...",
    time: "Jeudi",
    unreadCount: 0,
    online: false,
    archived: false,
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  },
  {
    id: 5,
    type: "squad",
    name: "Cours de Yoga",
    message: "Chat archivée par admin",
    time: "Mar 12",
    unreadCount: 0,
    online: false,
    archived: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=100&q=80",
  },
];

export function MessagesList() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      flex={1}
      paddingHorizontal="$4"
    >
      <YStack gap="$4">
        {MOCK_MESSAGES.map((msg) => (
          <MessageItem key={msg.id} item={msg} />
        ))}
      </YStack>
    </ScrollView>
  );
}
