export interface StepItem {
  id: string;
  title: string;
}

interface StepperProps {
  steps: StepItem[];
  activeStep: number;
  onStepClick?: (index: number) => void;
  accentColor?: string;
}

export default function Stepper({
  steps,
  activeStep,
  onStepClick,
  accentColor = "#003B5C",
}: StepperProps) {
  const progressWidth =
    steps.length > 1
      ? `${(activeStep / (steps.length - 1)) * 90}%`
      : "0%";

  return (
    <div className="mb-10 bg-white p-6 pb-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-10 top-1/2 -translate-y-1/2 w-[90%] h-[2px] bg-gray-100 z-0" />
        <div
          className="absolute left-10 top-1/2 -translate-y-1/2 h-[2px] z-0 transition-all duration-500 ease-in-out"
          style={{ width: progressWidth, backgroundColor: accentColor }}
        />

        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          const isClickable = isCompleted && !!onStepClick;

          return (
            <div
              key={step.id}
              className={[
                "relative z-10 px-6 flex flex-col items-center group",
                isClickable ? "cursor-pointer" : "cursor-default",
              ].join(" ")}
              onClick={() => isClickable && onStepClick(index)}
            >
              <div
                className={[
                  "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-[3px]",
                  isCompleted
                    ? "text-white shadow-md hover:scale-105"
                    : isActive
                    ? "bg-white shadow-lg scale-110"
                    : "bg-white border-gray-200 text-gray-400 hover:border-gray-300",
                ].join(" ")}
                style={
                  isCompleted
                    ? { backgroundColor: accentColor, borderColor: accentColor }
                    : isActive
                    ? {
                        borderColor: accentColor,
                        color: accentColor,
                        boxShadow: `0 0 0 4px ${accentColor}1A`, // 10% opacity ring
                      }
                    : {}
                }
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Label */}
              <span
                className={[
                  "absolute -bottom-6 text-xs font-semibold tracking-wide whitespace-nowrap transition-colors duration-300",
                  isActive
                    ? ""
                    : isCompleted
                    ? "text-gray-400 group-hover:text-gray-500"
                    : "text-gray-400 group-hover:text-gray-500",
                ].join(" ")}
                style={
                  isActive
                    ? { color: accentColor }
                    : isCompleted
                    ? { color: `${accentColor}CC` }
                    : {}
                }
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}