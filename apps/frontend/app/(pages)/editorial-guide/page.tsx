import { PageLayout } from "@/_components/PageLayout";

const EditorialGuide = async () => (
  <PageLayout title="Editorial guide">
    <div className="w-full space-y-[10px] page">
      <p>
        It's important that people reviewing on <strong>_nsigned</strong> feels
        comfortable and free to express themselves through their review how they
        want. However, the site is intended to read like a cohesive magazine
        more than a forum or advice column. Artists who submit their music for
        review should receive genuine and meaningful coverage without feeling
        like they are being marginalised.
      </p>
      <p>
        It's for these reasons that the site has some hard rules, as well as
        general guidelines, on how reviews should be written.
      </p>
      <h3>Rules</h3>
      <p>
        Reviews that do not follow these rules may be edited or deleted, and
        severe offenses may result in a site-wide ban.
      </p>
      <ol className="space-y-[7px]">
        <li>
          <strong>Be honest.</strong> Reviews have no value if they are not the
          honest opinion of the author.
        </li>
        <li>
          <strong>Be respectful.</strong> People work hard on and care about the
          music they put out there. Real people with real feelings are putting
          themselves out there, and so even if you do not like the music, any
          criticisms should be constructive instead of just saying "this is
          bad".
        </li>
        <li>
          <strong>Write for the reader.</strong> These reviews are not intended
          to be advice for the artist, but rather criticism of completed works.
          Write your reviews for someone who is looking for something new to
          listen to, not someone who has submitted music for review.
        </li>
        <li>
          <strong>Do not use AI.</strong> This site is a celebration of human
          creativity, and so the use of LLMs or any other form of generative AI
          is strictly prohibited. Translation tools like Google Translate are
          okay.
        </li>
        <li>
          <strong>Do not use slurs.</strong> The only context in which a slur
          may be acceptable is when directly quoting the lyrics of a song, in
          which case it <strong>must</strong> be censored entirely with
          asterisks (*) outside of the first letter. If you are in doubt as to
          whether something counts as a slur, it is better to err on the side of
          caution.
        </li>
        <li>
          <strong>Do not censor non-slur swear words.</strong> Swearing within
          reason is okay on this site and should not be censored.
        </li>
        <li>
          <strong>Write in English.</strong> This site does not currently
          support non-English languages and its audience. If the site ends up
          being very successful, there may be non-English variants in the future
          but for now it is English only.
        </li>
        <li>
          <strong>
            Obey the <a href="/terms">terms and conditions</a>.
          </strong>
        </li>
      </ol>
      <h3>Guidelines</h3>
      <p>
        These are not hard rules, but things you should keep in mind when
        writing your reviews.
      </p>
      <ol className="space-y-[7px]">
        <li>
          <strong>Be yourself.</strong> These are your reviews and you should
          feel free to get creative with it. If you want to use a specific
          editorial voice or style, go for it!
        </li>
        <li>
          <strong>Proof read your work.</strong> Not just for spelling and
          grammar, but also for clarity and pacing. If you want people to read
          your reviews, it's valuable to confirm that <em>you</em> are actually
          able to read it, too.
        </li>
        <li>
          <strong>Don't be crass.</strong> Swearing is okay on this site but you
          should still try and be sensible with it.
        </li>
        <li>
          <strong>Don't ramble.</strong> Your review should be primarily about
          the music. You can bring up aspects of your life or views on the
          world, but someone submitted this work to hear someone talk about what{" "}
          <em>they</em> made and as the reviewer you should respect that.
        </li>
      </ol>
    </div>
  </PageLayout>
);

export default EditorialGuide;
