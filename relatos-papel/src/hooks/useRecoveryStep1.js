import { useEffect, useMemo, useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useRecoveryStep1() {
  const [email, setEmail] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  return {
    email,
    setEmail,
    statusMsg,
    setStatusMsg
  };
}