export const Footer = () => (
  <footer className="max-w-[900px] w-full overflow-auto border-t border-t-secondary-500 pt-[20px] pb-[40px] text-[12px]">
    <div className="flex justify-between">
      <div className="flex flex-col">
        <h4 className="mb-[0.5rem]">Recommended sites</h4>
        <ul>
          <li>
            <a href="https://www.untidydownloads.com/" target="_blank">
              Untidy Music
            </a>
          </li>
          <li>
            <a href="https://ihrtn.net/" target="_blank">
              I Heart Noise
            </a>
          </li>
          <li>
            <a href="https://www.etherdiver.com/" target="_blank">
              Ether Diver
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="mb-[0.5rem]">Sister sites</h4>
        <ul>
          <li>
            <a href="https://releasecalendar.games" target="_blank">
              Video Game Release Calendar
            </a>
          </li>
          <li>
            <a href="https://moviemagic.fun" target="_blank">
              Movie Magic
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div className="flex justify-end">
      <p className="text-foreground-500 text-[10px]">© Thomas Marchant</p>
    </div>
  </footer>
);
