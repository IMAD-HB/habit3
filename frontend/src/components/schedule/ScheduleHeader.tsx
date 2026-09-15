interface ScheduleHeaderProps {
  hasPlan: boolean;
}

const ScheduleHeader = ({ hasPlan }: ScheduleHeaderProps) => {
  return (
    <header>
      <h1 className="text-2xl font-semibold tracking-tight">Schedule</h1>

      <p className="mt-2 text-sm text-gray-500">
        {hasPlan
          ? "Turn your weekly priorities into protected time."
          : "Create a weekly plan before scheduling your priorities."}
      </p>
    </header>
  );
};

export default ScheduleHeader;
