import { PageLayout } from "@/_components/PageLayout";

const About = async () => (
  <PageLayout title="About _nsigned">
    <div className="w-full space-y-[10px] page">
      <h3>What is it?</h3>
      <p>
        <strong>_nsigned</strong> is a music review site for small, DIY artists.
        The concept is that musicians can post their music, and other users can
        write up reviews that are published and displayed like an editorial
        site.
      </p>
      <p>
        The site was inspired by forums and music communities of the 2000s,
        before they were made apparently obsolete by one-size-fits-all platforms
        such as Reddit and Facebook. It hinges on the belief that there are
        people out there who want to talk about and share all the weird music
        they find.
      </p>
      <h3>How to use it</h3>
      <ul className="space-y-[7px]">
        <li>
          <strong>Artists</strong> should head to the{" "}
          <a href="/request-review">request review</a> page and post a Bandcamp
          link to the release they want to get reviewed. This will add the
          release to a liste for potential reviewers to pick from. As of right
          now, it is a requirement that the release be ready for reviewers to
          stream freely.
        </li>
        <li>
          <strong>Reviewers</strong> should head to the{" "}
          <a href="/review-requests">review requests</a> page and claim the
          release they want to review. Once the release has been claimed, they
          can write the review and publish it to the site. Reviewers should
          check the <a href="/editorial-guide">editorial guide</a> before
          submitting.
        </li>
        <li>
          <strong>Readers</strong> don't need to do anything special, although
          if they enjoyed the release or the review they should feel free to let
          the artist and the reviewer know in the comments!
        </li>
      </ul>
      <h3>Core values</h3>
      <p>
        <strong>_nsigned</strong> is built around a few core values:
      </p>
      <ul className="space-y-[7px]">
        <li>
          Artists should not be at a disadvantage if they cannot afford to pay
          for promotion or coverage.
        </li>
        <li>
          Artists should not be expected to promote themselves by playing the
          social media game in order to get listeners.
        </li>
        <li>The value of art comes from the humans making it.</li>
      </ul>
      <p>
        Many of the greatest musicians of the past 100 years have been working
        class, many have been shy and awkward, many have been reclusive, but the
        systems currently in place put unfair limitations on those people and
        the world at large is missing out on great music that never gets heard
        as a result.
      </p>
    </div>
  </PageLayout>
);

export default About;
