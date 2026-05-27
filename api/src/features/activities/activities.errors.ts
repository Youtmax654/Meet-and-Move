const joinActivityErrorMap = {
  ALREADY_JOINED: {
    status: 409,
    message: "You already joined this activity!",
  },
  ACTIVITY_NOT_FOUND: {
    status: 404,
    message: "Activity not found",
  },
  ACTIVITY_FULL: {
    status: 409,
    message: "Activity is full",
  },
} as const;

type JoinActivityErrorKey = keyof typeof joinActivityErrorMap;

type MappedError = {
  key: JoinActivityErrorKey;
  status: (typeof joinActivityErrorMap)[JoinActivityErrorKey]["status"];
  message: (typeof joinActivityErrorMap)[JoinActivityErrorKey]["message"];
};

function isJoinActivityErrorKey(value: string): value is JoinActivityErrorKey {
  return value in joinActivityErrorMap;
}

export function mapJoinActivityError(error: unknown): MappedError | null {
  if (!error || typeof error !== "string" || !isJoinActivityErrorKey(error)) {
    return null;
  }

  return { key: error, ...joinActivityErrorMap[error] };
}
