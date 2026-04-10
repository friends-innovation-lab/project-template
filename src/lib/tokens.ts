import fftcTokens from "../../tokens.json";
import uswdsTokens from "../../tokens.uswds.json";
import vaTokens from "../../tokens.va.json";
import cmsTokens from "../../tokens.cms.json";

export type AgencyTheme = "fftc" | "uswds" | "va" | "cms";

const tokenMap = {
  fftc: fftcTokens,
  uswds: uswdsTokens,
  va: vaTokens,
  cms: cmsTokens,
};

export function getActiveTokens() {
  const theme = (process.env.NEXT_PUBLIC_AGENCY_THEME as AgencyTheme) || "fftc";
  return tokenMap[theme] || tokenMap.fftc;
}

export function getAgencyTheme(): AgencyTheme {
  return (process.env.NEXT_PUBLIC_AGENCY_THEME as AgencyTheme) || "fftc";
}
