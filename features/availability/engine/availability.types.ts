export type AvailabilitySessionType =
  | "MORNING"
  | "AFTERNOON";

export type AvailableSlot = {
  start: string;
  end: string;
  blockedUntil: string;
};

export type AvailabilitySession = {
  type: AvailabilitySessionType;

  /**
   * Session boundaries displayed in the UI.
   *
   * Example:
   * 09:00 -> 13:00
   */
  start: string;
  end: string;

  slots: AvailableSlot[];
};

export type AvailabilityResult = {
  date: string;
  timezone: string;
  available: boolean;

  staff: {
    id: string;
    name: string;
  };

  service: {
    id: string;
    name: string;
    durationMinutes: number;
    bufferMinutes: number;
  };

  sessions: AvailabilitySession[];
};