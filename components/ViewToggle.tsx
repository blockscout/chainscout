import CardViewIcon from '@/icons/card_view.svg';
import ListViewIcon from '@/icons/list_view.svg';

export type ViewMode = 'list' | 'card';

type ViewToggleProps = {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
};

const viewOptions: Array<{
  value: ViewMode;
  label: string;
  Icon: typeof ListViewIcon;
}> = [
  { value: 'list', label: 'List view', Icon: ListViewIcon },
  { value: 'card', label: 'Card view', Icon: CardViewIcon },
];

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex h-[44px] w-[88px] shrink-0 items-center" role="group" aria-label="View mode">
      {viewOptions.map(({ value: optionValue, label, Icon }, index) => {
        const isActive = value === optionValue;
        const isListOption = index === 0;

        return (
          <button
            key={optionValue}
            type="button"
            aria-label={label}
            aria-pressed={isActive}
            title={label}
            onClick={() => onChange(optionValue)}
            className={`flex h-full w-[44px] items-center justify-center p-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 ${
              isActive
                ? 'border border-[#2563eb] bg-[#2563eb] text-white'
                : 'border-[#d0d5dd] bg-white text-[#b1b5c3] hover:bg-[#f2f4fc] hover:text-[#6b6b74]'
            } ${
              isListOption
                ? `${isActive ? '' : 'border-b border-l border-t'} rounded-l-lg border-r-0`
                : `${isActive ? '' : 'border-b border-r border-t'} rounded-r-lg border-l-0`
            }`}
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
