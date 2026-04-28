import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import { Platform } from "react-native";
import { Button, Input, Text, XStack, YStack } from "tamagui";

type LocationDateSectionProps = {
  location: string;
  eventDate: Date | null;
  onLocationChange: (value: string) => void;
  onEventDateChange: (value: Date | null) => void;
};

export function LocationDateSection({
  location,
  eventDate,
  onLocationChange,
  onEventDateChange,
}: LocationDateSectionProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const displayDate = useMemo(() => eventDate ?? new Date(), [eventDate]);
  const dateLabel = useMemo(
    () =>
      eventDate
        ? eventDate.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Choisir une date",
    [eventDate],
  );
  const timeLabel = useMemo(
    () =>
      eventDate
        ? eventDate.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Choisir une heure",
    [eventDate],
  );

  const handleDateChange = (_event: unknown, selected?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (!selected) return;

    const next = new Date(displayDate);
    next.setFullYear(
      selected.getFullYear(),
      selected.getMonth(),
      selected.getDate(),
    );
    onEventDateChange(next);
  };

  const handleTimeChange = (_event: unknown, selected?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    if (!selected) return;

    const next = new Date(displayDate);
    next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
    onEventDateChange(next);
  };

  return (
    <YStack gap={12}>
      <Text fontSize={16} fontWeight="700" color="#1E2228">
        Lieu et date
      </Text>
      <XStack gap={12} flexWrap="wrap">
        <YStack flex={1} minWidth={160} gap={6}>
          <Text fontSize={12} color="#6B727B">
            Ville
          </Text>
          <Input
            value={location}
            onChangeText={onLocationChange}
            placeholder="Ex: Lyon"
            backgroundColor="#FFFFFF"
            borderColor="#E5E5E3"
            focusStyle={{ borderColor: "#006666" }}
          />
        </YStack>
        <YStack flex={1} minWidth={160} gap={6}>
          <Text fontSize={12} color="#6B727B">
            Date & heure
          </Text>
          <YStack gap={8}>
            <Button
              height={44}
              justifyContent="flex-start"
              backgroundColor="#FFFFFF"
              borderWidth={1}
              borderColor="#E5E5E3"
              color="#1E2228"
              onPress={() => setShowDatePicker(true)}
            >
              {dateLabel}
            </Button>
            <Button
              height={44}
              justifyContent="flex-start"
              backgroundColor="#FFFFFF"
              borderWidth={1}
              borderColor="#E5E5E3"
              color="#1E2228"
              onPress={() => setShowTimePicker(true)}
            >
              {timeLabel}
            </Button>
          </YStack>
        </YStack>
      </XStack>
      {showDatePicker ? (
        <DateTimePicker
          value={displayDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      ) : null}
      {showTimePicker ? (
        <DateTimePicker
          value={displayDate}
          mode="time"
          is24Hour
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      ) : null}
    </YStack>
  );
}
