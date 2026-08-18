"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { get } from "@/_utils/api.client";

import type { PlayState } from "@/_types";
import type { URL, Track } from "@/_types/api";

type PlayerContextType = {
  track: Track | null;
  playState: PlayState;
  open: boolean;
  error: string | null;
  trackURL: string | null;
  playTrack: (track: Track) => Promise<void>;
  setPlayState: (playState: PlayState) => void;
  closePlayer: () => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

type PlayerProviderProps = {
  children: React.ReactNode;
};

export const PlayerProvider = ({ children }: PlayerProviderProps) => {
  const [track, setTrack] = useState<Track | null>(null);
  const [playState, setPlayState] = useState<PlayState>("paused");
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [trackURL, setTrackURL] = useState<string | null>(null);

  const playTrack = useCallback(async (newTrack: Track) => {
    setOpen(true);
    setPlayState("loading");
    setTrack(newTrack);
    const urlResponse = await get<URL>({
      endpoint: `music/track/${newTrack.id}/mp3-link`,
    });
    if (!urlResponse.ok) {
      setPlayState("paused");
      setError("Could not load track");
      return;
    }
    setTrackURL(urlResponse.data.url);
    setPlayState("playing");
  }, []);

  useEffect(() => {
    setOpen(!!track);
  }, [track]);

  const closePlayer = useCallback(() => {
    setTrack(null);
    setPlayState("paused");
    setOpen(false);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        track,
        playState,
        open,
        error,
        trackURL,
        playTrack,
        setPlayState,
        closePlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used inside PlayerProvider");
  return context;
};
