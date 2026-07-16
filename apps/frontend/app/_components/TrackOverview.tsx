import { TrackPlayButton } from "@/_components/TrackPlayButton";

import type { Track } from "@/_types/api";

type TrackOverviewProps = {
  track: Track;
}

export const TrackOverview = ({ track }: TrackOverviewProps) => {
  return <div className="flex flex-col">
    <p>{track.release.primary_artist!.name}</p>
    <p>{track.release.title}</p>
    <p>{track.track_number}. {track.title}</p>
    <TrackPlayButton track={track} />
  </div>
}
