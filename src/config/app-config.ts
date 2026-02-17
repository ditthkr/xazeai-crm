import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

/**
 * Application configuration.
 * Contains global settings like app name, version, and metadata.
 */
export const APP_CONFIG = {
  name: "Xaze.ai",
  version: packageJson.version,
  copyright: `© ${currentYear}, Xaze.ai.`,
  meta: {
    title: "Xaze.ai",
    description: "Xaze.ai Dashboard",
  },
};
