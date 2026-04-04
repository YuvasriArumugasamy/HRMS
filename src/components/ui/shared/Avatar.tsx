import { getAvatarGradient, getInitialsForList } from "@/core/utils/helpers";

interface AvatarProps {
    firstName: string;
    surname: string;
    seed: string;
    size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-12 h-12 text-sm",
};

export default function Avatar({ firstName, surname, seed, size = "md" }: AvatarProps) {
    return (
        <div
            className={`${SIZE_CLASSES[size]} rounded-full flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0`}
            style={{ background: getAvatarGradient(seed) }}
        >
            {getInitialsForList(firstName, surname)}
        </div>
    );
}