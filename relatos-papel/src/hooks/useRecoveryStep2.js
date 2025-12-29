    import { useState } from "react";
    
    export function useRecoveryStep2() {
      const [code, setCode] = useState("");
      const [statusMsg, setStatusMsg] = useState("");

      return {
        code,
        setCode,
        statusMsg,
        setStatusMsg
      };
    }