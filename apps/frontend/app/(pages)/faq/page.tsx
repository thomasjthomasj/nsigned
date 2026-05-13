import { PageLayout } from "@/_components/PageLayout";

const FAQ = async () => (
  <PageLayout title="Frequently asked questions">
    <div className="w-full space-y-[10px] page">
      <h3>
        What is <strong>_nsigned</strong>?
      </h3>
      <p>
        <strong>_nsigned</strong> is a site that publishes reviews of DIY music.
        Anyone can get their music reviewed, and anyone review peoples' music.
      </p>

      <h3>Who is it for?</h3>
      <p>
        <strong>_nsigned</strong> is primarily aimed at three types of people:
      </p>
      <ul className="space-y-[7px]">
        <li>
          DIY musicians who want to get their music heard and talked about.
        </li>
        <li>
          Music lovers who want somewhere to talk about the weird and wonderful
          DIY music they've been listenined to.
        </li>
        <li>
          People who are looking for something new to listen to and need
          guidance.
        </li>
      </ul>

      <h3>What is the goal of the site?</h3>
      <p>
        The main goal of the site is to help level the playing field and help
        artists get their work out there. More than ever, artists are at an
        advantage if they can afford promotion, or if they have a personality
        type that suits posting videos on social media. There must be so much
        great music out there that never gets heard because the artist doesn't
        have the means or personality to get people to pay attention. This site
        aims to fix that.
      </p>

      <h3>Why only Bandcamp?</h3>
      <p>
        The site currently only supports Bandcamp for purely practical reasons:
      </p>
      <ul className="space-y-[7px]">
        <li>
          Most DIY artists use Bandcamp, even if they prefer other platforms.
        </li>
        <li>
          Each supported platform requires different, unique ways to integrate
          them and adds a tonne of work. The site as it exists now is developed
          by one person for free, and it's simply unfeasible to support all
          these different platforms at the moment.
        </li>
        <li>
          Only supporting one platform allows it to act as a single source of
          truth. If an artist has a slightly different name on a different
          platform, it could end up being duplicated on this site.
        </li>
      </ul>

      <h3>Will other platforms be supported in the future?</h3>
      <p>
        It's possible. It largely depends on how successful the site is in the
        long term. However, there are currently no plans to support other
        platforms.
      </p>

      <h3>Which music qualifies?</h3>
      <p>
        Almost anything, as long as it's on Bandcamp. The only restrictions are
        that it must be <strong>music</strong> and not a podcast or anything
        like that, and it must not have been made by AI.
      </p>

      <h3>Is it possible to filter reviews by genre?</h3>
      <p>
        No, and hopefully it never will be. While genres are a useful way to
        talk about and categorise music, it is also extremely limiting both in
        peoples' taste and in terms of discovery. Someone who loves rock music
        and only ever looks for rock music might love jazz if they just listened
        to it.
      </p>

      <h3>Do writers get paid?</h3>
      <p>The short answer is no.</p>
      <p>
        The long answer is no, in part because the site makes no money and so
        there is no money to pay writers, but in larger part because this is a
        site intended for hobbyists, not journalists. The ethos of the site
        relies on the idea that there are people who are compelled to write
        about music and want a place where they can do it. Where the intrinsic
        reward is writing something that other people will read, rather than the
        extrinsic reward of being paid for it. If someone were to view writing
        for this site as <em>work</em> then I would recommend that they stop
        immediately, both for their own benefit and the benefit of the site.
      </p>
      <p>
        To put it bluntly, while the site may ape some of the aesthetics of
        journalism, it is not genuine journalism and should not be viewed as
        such. Journalism is a legitimate career that takes skill and training,
        and is an essential part of society. This site should really function
        closer to a forum than a genuine editorial site.
      </p>
      <p>
        That said, reviewers can add a fundraiser link to their profile which
        will appear on all reviews they write. Currently the supported platforms
        are PayPal, Ko-Fi, Buymeacoffee, and Patreon.
      </p>

      <h3>Will the site ever be monetized?</h3>
      <p>
        Currently the site has no monetization at all, and if the site remains
        small then that's unlikely to change. However, if the site becomes
        extremely popular it's going to be difficult to maintain without any
        form of income backing it up. What exactly that would look like isn't
        clear. However, any monetization would absolutely not involve the
        ability for artists to pay for extra coverage. The playing field must
        remain level at all times.
      </p>

      <h3>Why is it called that?</h3>
      <p>
        It is a rule of the internet that the most successful websites are
        typically ones where the name is a normal word with one letter either
        removed or added.
      </p>
    </div>
  </PageLayout>
);

export default FAQ;
