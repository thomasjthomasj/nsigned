import { PageLayout } from "@/_components/PageLayout";

const AIPolicy = async () => (
  <PageLayout title="AI policy">
    <div className="w-full space-y-[10px] page">
      <p>
        AI is one of the most annoying things to have happened to the internet,
        and I was hoping that I could basically ignore it for as long as
        possible, but it has come up enough that it's become necessary to set a
        firm stance on AI content on <strong>_nsigned</strong>.
      </p>
      <h3>Is AI music allowed?</h3>
      <p>
        AI music is not allowed, but since AI music is also against Bandcamp's
        policy, resposibility for determining if a piece of music is AI is
        deferred to them. Anyone reviewing music on <strong>_nsigned</strong>{" "}
        should make the assumption that AI was not used in its production.
      </p>
      <h3>
        What should I do if the music <em>really</em> sounds like AI?
      </h3>
      <p>
        If you are certain that the music is AI, then you should report it to
        Bandcamp via the <strong>Report this album/track or account</strong>{" "}
        link on the release's Bandcamp page. Outside of that, just leave it in
        the queue. If the music was made by AI, the chances are that it will be
        so generic that any review will be fairly negative anyway.
      </p>
      <h3>
        What should I do if I see a review or review request for an album that
        has been deleted from Bandcamp
      </h3>
      <p>
        If you have joined the{" "}
        <a href="https://discord.gg/A4hRDQmUYk" target="_blank">
          Discord
        </a>
        , you can report it via the <strong>#report-deleted-music</strong>{" "}
        channel. If not, either leave a comment on the review itself, or if it
        is just a request, leave it in the queue for someone else to catch.
      </p>
      <h3>What should I do if I believe that a review was written by AI?</h3>
      <p>
        If you have joined the{" "}
        <a href="https://discord.gg/A4hRDQmUYk" target="_blank">
          Discord
        </a>
        , you can report it via the <strong>#report-ai-review</strong> channel.
        If not, please leave a <strong>civil</strong> comment stating that you
        believe it was written by AI. Do <em>not</em> start an argument with the
        writer.
      </p>
      <h3>Is AI cover art allowed?</h3>
      <p>
        AI cover art is discouraged but not forbidden. This is a website about
        music and music criticism, and while the cover art is a core part of a
        release, it is not the focus.
      </p>
      <hr className="border-primary-500 my-[20px]" />
      <p>
        Ultimately, discussion about AI should not dominate the site, and I
        would rather give people the benefit of the doubt than incorrectly
        accuse something of being AI.
      </p>
    </div>
  </PageLayout>
);

export default AIPolicy;
