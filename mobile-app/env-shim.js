import { EXPO_PUBLIC_API_BASE_URL } from "@env";

global.process = {
  env: {
    EXPO_PUBLIC_API_BASE_URL,
  },
};
