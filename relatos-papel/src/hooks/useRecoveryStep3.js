import { useState } from "react";

export function useRecoveryStep3() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    statusMsg,
    setStatusMsg
  };
}