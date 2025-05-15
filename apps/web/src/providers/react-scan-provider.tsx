"use client";

import React, { useEffect } from "react";
import { scan } from "react-scan";

export const ReactScanProvider = () => {
  useEffect(() => {
    scan({
      enabled: false,
    });
  }, []);
  return <></>;
};
