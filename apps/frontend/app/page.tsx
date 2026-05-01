import { RegistrationForm } from "@/_components/forms/RegistrationForm"
import { RequestReviewForm } from "@/_components/forms/RequestReviewForm";
import { CookiesProvider } from "@/_components/providers/CookiesProvider"

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <CookiesProvider>
            <div>
              <RegistrationForm />
              <RequestReviewForm />
            </div>
          </CookiesProvider>
        </div>
      </main>
    </div>
  );
}
