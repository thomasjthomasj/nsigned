export const PAIR_DIVIDER = "::";
export const KV_DIVIDER = ":";

export const parseState = (state: string) => {
  const pairs = state.split(PAIR_DIVIDER);
  const stateVars: Record<string, string> = {};
  for (const kv of pairs) {
    const [k, v] = kv.split(KV_DIVIDER);
    stateVars[k] = v;
  }
  return stateVars;
};
