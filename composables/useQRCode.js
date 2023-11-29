import { useQRCode } from "@vueuse/integrations/useQRCode";

export const useQR = (text, options) => {
  const qrcode = useQRCode(text, options);
  return qrcode;
};
