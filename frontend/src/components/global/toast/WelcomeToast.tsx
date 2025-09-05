import { toast } from "sonner";

export const WelcomeToast = () => {
  toast.custom((t) => (
    <div
      className={`max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5 text-2xl">👋</div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">Hello!</p>
            <p className="mt-1 text-sm text-gray-500">Nice to see you 👋</p>
          </div>
        </div>
      </div>
    </div>
  ));
};
