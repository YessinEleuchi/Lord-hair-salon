"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  CustomerNotificationStatus,
} from "@/features/appointments/utils/whatsapp";

export type CustomerNotificationData = {
  status: CustomerNotificationStatus;

  customerName: string;
  customerPhone: string;
  serviceName: string;

  date: string;
  time: string;
};

type CustomerNotificationContextValue = {
  notification:
    | CustomerNotificationData
    | null;

  openCustomerNotification: (
    data: CustomerNotificationData,
  ) => void;

  closeCustomerNotification: () => void;
};

const CustomerNotificationContext =
  createContext<
    CustomerNotificationContextValue
    | undefined
  >(undefined);

export function CustomerNotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    notification,
    setNotification,
  ] =
    useState<CustomerNotificationData | null>(
      null,
    );

  const openCustomerNotification =
    useCallback(
      (
        data: CustomerNotificationData,
      ) => {
        setNotification(data);
      },
      [],
    );

  const closeCustomerNotification =
    useCallback(() => {
      setNotification(null);
    }, []);

  const value = useMemo(
    () => ({
      notification,
      openCustomerNotification,
      closeCustomerNotification,
    }),
    [
      notification,
      openCustomerNotification,
      closeCustomerNotification,
    ],
  );

  return (
    <CustomerNotificationContext.Provider
      value={value}
    >
      {children}
    </CustomerNotificationContext.Provider>
  );
}

export function useCustomerNotification() {
  const context =
    useContext(
      CustomerNotificationContext,
    );

  if (!context) {
    throw new Error(
      "useCustomerNotification must be used inside CustomerNotificationProvider.",
    );
  }

  return context;
}