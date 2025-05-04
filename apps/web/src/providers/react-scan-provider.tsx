"use client";

import React, { JSX, useEffect } from "react";
import { scan } from "react-scan";

const ReactScanProvider = (): JSX.Element => {
  useEffect(() => {
    scan({
      enabled: true,
    });
  }, []);
  return <></>;
};

export default ReactScanProvider;
