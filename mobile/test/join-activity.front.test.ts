import React from "react";
import { act, create } from "react-test-renderer";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ActionBar } from "../components/experience-details/action-bar";
import type { Activity } from "../types/activity";

const {
  routerPush,
  routerReplace,
  invalidateQueries,
  showToast,
  apiPost,
  getUserId,
} = vi.hoisted(() => ({
  routerPush: vi.fn(),
  routerReplace: vi.fn(),
  invalidateQueries: vi.fn(async () => undefined),
  showToast: vi.fn(),
  apiPost: vi.fn(async () => undefined),
  getUserId: vi.fn(async () => "user-1"),
}));

vi.mock("expo-router", () => ({
  useRouter: () => ({ push: routerPush, replace: routerReplace }),
}));

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries }),
}));

vi.mock("../context/toast-context", () => ({
  useToast: () => ({ showToast }),
}));

vi.mock("@/lib/api", () => ({
  api: { post: apiPost },
  getUserId,
}));

vi.mock("@expo/vector-icons", () => ({
  Ionicons: () => null,
}));

vi.mock("tamagui", () => {
  const ReactModule = require("react");

  const MockView = ({ children, ...props }: any) =>
    ReactModule.createElement("div", props, children);
  const MockText = ({ children, ...props }: any) =>
    ReactModule.createElement("span", props, children);
  const MockButton = ({ children, onPress, ...props }: any) =>
    ReactModule.createElement(
      "button",
      { ...props, onClick: onPress },
      children,
    );
  const MockSpinner = (props: any) =>
    ReactModule.createElement("span", props, "spinner");

  return {
    View: MockView,
    XStack: MockView,
    Text: MockText,
    Button: MockButton,
    Spinner: MockSpinner,
  };
});

describe("ActionBar join activity", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    getUserId.mockResolvedValue("user-1");
  });

  it("calls join API, invalidates inbox, shows toast and redirects", async () => {
    const activity: Activity = {
      id: "activity-123",
      title: "Escalade",
      description: "Test activity",
      participants: [],
      chatId: "chat-1",
    };

    let renderer: any;
    await act(async () => {
      renderer = create(React.createElement(ActionBar, { activity }));
    });

    const buttons = renderer.root.findAllByType("button");
    expect(buttons.length).toBeGreaterThan(0);

    await act(async () => {
      buttons[0].props.onClick();
    });

    expect(apiPost).toHaveBeenCalledWith("/activities/activity-123/join");
    expect(invalidateQueries).toHaveBeenCalledTimes(1);
    expect(showToast).toHaveBeenCalledWith(
      'Bravo ! Tu as rejoint l\'activité "Escalade"',
      "success",
    );

    await act(async () => {
      vi.advanceTimersByTime(1500);
    });

    expect(routerReplace).toHaveBeenCalledWith("/(tabs)");
  });
});
